import React from 'react';
import { View } from '../types';
import { IconDashboard, IconAssets, IconSimulations, IconAnalysis, IconRisks, IconReports, IconSupport, IconLinkedIn, IconGitHub, IconInstagram, IconX, IconYouTube, IconBlog } from '../constants';

interface SidebarProps {
  activeView: View;
  setView: (view: View) => void;
}

const socialMediaLinks = {
    linkedin: "https://www.linkedin.com/company/hereandnowai/",
    github: "https://github.com/hereandnowai",
    instagram: "https://instagram.com/hereandnow_ai",
    x: "https://x.com/hereandnow_ai",
    youtube: "https://youtube.com/@hereandnow_ai",
    blog: "https://hereandnowai.com/blog",
};


const NavItem: React.FC<{
  icon: React.ReactNode;
  label: View;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex items-center p-3 my-1 w-full text-sm rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-accent text-brand-secondary font-bold'
          : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
      }`}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </button>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setView }) => {
  const navItems = [
    { id: View.Dashboard, icon: <IconDashboard />, label: View.Dashboard },
    { id: View.Assets, icon: <IconAssets />, label: View.Assets },
    { id: View.Simulations, icon: <IconSimulations />, label: View.Simulations },
    { id: View.Analysis, icon: <IconAnalysis />, label: View.Analysis },
    { id: View.Risks, icon: <IconRisks />, label: View.Risks },
    { id: View.Reports, icon: <IconReports />, label: View.Reports },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-secondary border-r border-border-color p-4 flex flex-col">
      <div className="flex items-center mb-6 px-2">
         <img src="https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png" alt="HERE AND NOW AI Logo" className="h-12" />
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeView === item.id}
              onClick={() => setView(item.id)}
            />
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-4">
        <div>
          <ul>
            <NavItem
                icon={<IconSupport />}
                label={View.Support}
                isActive={activeView === View.Support}
                onClick={() => setView(View.Support)}
            />
          </ul>
        </div>
        <div className="px-3">
             <h3 className="text-xs text-text-secondary uppercase font-semibold mb-2">Social</h3>
             <div className="flex items-center space-x-3 text-text-secondary">
                 <a href={socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent"><IconLinkedIn /></a>
                 <a href={socialMediaLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent"><IconGitHub /></a>
                 <a href={socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent"><IconInstagram /></a>
                 <a href={socialMediaLinks.x} target="_blank" rel="noopener noreferrer" className="hover:text-accent"><IconX /></a>
                 <a href={socialMediaLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-accent"><IconYouTube /></a>
                 <a href={socialMediaLinks.blog} target="_blank" rel="noopener noreferrer" className="hover:text-accent"><IconBlog /></a>
             </div>
        </div>
        <div className="px-3 pt-4 border-t border-border-color">
            <p className="text-xs text-text-secondary">developed by SHALINI</p>
            <p className="text-xs text-text-secondary">[AI products engineering team]</p>
        </div>
      </div>
    </aside>
  );
};