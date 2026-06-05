import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-oswald text-2xl font-bold tracking-wider text-accent mb-3">DETROIT DYNAMO</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Detroit's player development pathway: training academy, youth club growth, and senior team ambition.
            </p>
          </div>
          <div>
            <h4 className="font-oswald text-sm font-semibold tracking-wider text-foreground mb-4">QUICK LINKS</h4>
            <div className="space-y-2">
              <Link to="/detroit-dynamo/about" className="block text-sm text-muted-foreground hover:text-accent transition-colors">About</Link>
              <Link to="/detroit-dynamo/training" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Training Academy</Link>
              <Link to="/detroit-dynamo/youth-club" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Youth Club</Link>
              <Link to="/detroit-dynamo/tryouts" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Tryouts</Link>
              <Link to="/detroit-dynamo/book" className="block text-sm text-muted-foreground hover:text-accent transition-colors">Book Training</Link>
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
            © {new Date().getFullYear()} Detroit Dynamo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
