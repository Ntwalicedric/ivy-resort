import React from 'react';
import Image from '../../../components/AppImage';

const BackgroundOverlay = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Ivy Resort luxury hotel lobby with elegant interior design"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat opacity-30" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-accent/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-accent/40 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-accent/20 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-32 w-1 h-1 bg-accent/30 rounded-full animate-pulse delay-500"></div>

      {/* Subtle Light Rays */}
      <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-accent/20 to-transparent transform rotate-12"></div>
      <div className="absolute top-0 right-1/3 w-px h-24 bg-gradient-to-b from-accent/15 to-transparent transform -rotate-12"></div>
    </div>
  );
};

export default BackgroundOverlay;