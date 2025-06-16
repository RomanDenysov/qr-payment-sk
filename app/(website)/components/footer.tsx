export function Footer() {
  return (
    <footer className="container mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} QR Platby. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
