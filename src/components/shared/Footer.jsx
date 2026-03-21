const Footer = () => (
  <footer className="border-t border-border mt-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-text-secondary text-sm">
      <p className="mb-1">
        &copy; {new Date().getFullYear()} ALGO Vision. Built By Abhinav Mishra .
      </p>
      <p className="text-xs text-text-secondary/70">
        Crafted for learners who want to see, understand, implement, and then test their knowledge of algorithms.
      </p>
    </div>
  </footer>
);

export default Footer ;