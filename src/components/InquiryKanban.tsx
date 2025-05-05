'use client';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import useSWR from 'swr';
import { useState } from 'react';

interface Inquiry {
  id: string;
  subject: string;
  status: 'New' | 'InProgress' | 'Closed';
  clientEmail: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function InquiryKanban() {
  const { data: inquiries, mutate, isLoading, error } = useSWR<Inquiry[]>('/api/inquiries', fetcher);
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Inquiry['status'];

    try {
      // Optimistic UI update
      mutate(
        inquiries?.map(inquiry => (inquiry.id === draggableId ? { ...inquiry, status: newStatus } : inquiry)),
        { revalidate: false }
      );

      // API call to update status
      const response = await fetch(`/api/inquiries/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Update failed');

      // Show success feedback
      setSnackbar({ message: 'Status updated!', type: 'success' });

      // Revalidate data after 1s (gives time for UI feedback)
      setTimeout(() => mutate(), 1000);
    } catch (error) {
      // Rollback on error
      mutate();
      setSnackbar({
        message: 'Failed to update status. Please try again.',
        type: 'error'
      });
      console.error('Update error:', error);
    } finally {
      // Auto-hide snackbar after 3s
      setTimeout(() => setSnackbar(null), 3000);
    }
  };

  // Group inquiries by status for better rendering
  const groupedInquiries = {
    New: inquiries?.filter(i => i.status === 'New') || [],
    InProgress: inquiries?.filter(i => i.status === 'InProgress') || [],
    Closed: inquiries?.filter(i => i.status === 'Closed') || []
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      Failed to load inquiries. Please refresh the page.
    </div>
  );

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['New', 'InProgress', 'Closed'] as const).map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-lg p-4 min-h-[200px]"
                >
                  <h2 className="font-bold text-lg mb-4 flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${status === 'New' ? 'bg-blue-500' : status === 'InProgress' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                    {status} ({groupedInquiries[status].length})
                  </h2>

                  {groupedInquiries[status].map((inquiry, index) => (
                    <Draggable
                      key={inquiry.id}
                      draggableId={inquiry.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-3 p-3 rounded border ${
                            snapshot.isDragging
                              ? 'bg-white shadow-lg border-blue-300'
                              : 'bg-white border-gray-200'
                          } transition-colors`}
                        >
                          <p className="font-medium truncate">{inquiry.subject}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {inquiry.clientEmail}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Snackbar Notification */}
      {snackbar && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded ${snackbar.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} shadow-md transition-opacity duration-300`}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
}
