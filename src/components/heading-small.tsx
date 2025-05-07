export default function HeadingSmall({ title, description, cta }: { title: string; description?: string; cta?: React.ReactNode }) {
    return (
        <header className="flex items-center justify-between">
            <div>
                <h3 className="mb-0.5 text-base font-medium">{title}</h3>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
            {cta && <div className="flex items-center gap-2">{cta}</div>}
        </header>
    );
}
