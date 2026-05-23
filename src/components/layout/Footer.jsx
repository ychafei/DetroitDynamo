import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-oswald text-2xl font-bold tracking-wider text-accent mb-3">LC TRAINING</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Elite soccer coaching across Metro Detroit. Oakland, Macomb, and Wayne counties.
            </p>
          </div>
          <div>
            <h4 className="font-oswald text-sm font-semibold tracking-wider text-foreground mb-4">QUICK LINKS</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-accent transition-colors">About Us</Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Blog</Link>
              <Link to="/apply" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Become a Coach</Link>
              <Link to="/book" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Book a Session</Link>
              <Link to="/detroit-dynamo-preview" className="block text-sm text-muted-foreground/75 hover:text-[#6FE7FF] transition-colors">Rebrand Preview</Link>
            </div>
          </div>
          <div>
            <h4 className="font-oswald text-sm font-semibold tracking-wider text-foreground mb-4">LEGAL</h4>
            <div className="space-y-2">
              <Link to="/terms" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Privacy Policy</Link>
              <Link to="/unsubscribe" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Unsubscribe</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} LC Training. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
