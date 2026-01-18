export const DashboardPreview = () => {
  return (
    <section className="hidden lg:flex lg:w-1/2 bg-muted/30 p-8">
      <div className="h-full flex flex-col justify-center items-center">
        <div className="max-w-lg w-full">
          <div className="mb-6">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <p className="text-sm font-medium text-muted-foreground">
                Welcome to Cofrinio
              </p>
            </div>
            <div className="flex justify-between items-center mt-1">
              <h3 className="text-xl font-semibold text-foreground">
                Start Your Financial Journey
              </h3>
              <a
                href="#"
                className="text-sm text-primary flex items-center hover:text-primary/80 transition duration-200"
              >
                Learn More <span className="ml-1">→</span>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Join thousands of users who are already managing their finances
              with Cofrinio.
            </p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="/assets/login-dashboard.png"
              alt="Cofrinio Dashboard Preview"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

