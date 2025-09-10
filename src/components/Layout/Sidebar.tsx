import React from 'react';
import { 
  Database, 
  Globe, 
  FolderOpen, 
  Settings, 
  Home,
  ChevronRight
} from 'lucide-react';
import { ViewMode, WorkspaceTab } from '../../types';

interface SidebarProps {
  viewMode: ViewMode;
  workspaceTab: WorkspaceTab;
  currentProject: { id: string; name: string } | null;
  onNavigate: (mode: ViewMode, tab?: WorkspaceTab) => void;
}

export function Sidebar({ viewMode, workspaceTab, currentProject, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">API Designer</h1>
            <p className="text-slate-400 text-sm">接口设计器</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('projects')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              viewMode === 'projects'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>项目管理</span>
          </button>

          {currentProject && (
            <div className="mt-6">
              <div className="px-3 mb-3">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                  当前项目
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <FolderOpen className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">{currentProject.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => onNavigate('workspace', 'datasources')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    viewMode === 'workspace' && workspaceTab === 'datasources'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Database className="w-5 h-5" />
                  <span>数据源管理</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={() => onNavigate('workspace', 'interfaces')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    viewMode === 'workspace' && workspaceTab === 'interfaces'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>接口管理</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-slate-400 text-xs">
          <p>© 2025 API Designer</p>
          <p>企业级接口设计平台</p>
        </div>
      </div>
    </div>
  );
}