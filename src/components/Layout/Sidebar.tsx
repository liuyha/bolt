import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Database, 
  Globe, 
  FolderOpen, 
  Settings, 
  Home,
  ChevronRight,
  Users
} from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const projectId = params.projectId;
  const isProjectRoute = location.pathname.includes('/project/');

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
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>项目管理</span>
          </button>

          {isProjectRoute && projectId && (
            <div className="mt-6">
              <div className="px-3 mb-3">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                  项目工作区
                </p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => navigate(`/project/${projectId}/members`)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    location.pathname.includes('/members')
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>成员管理</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={() => navigate(`/project/${projectId}/datasources`)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    location.pathname.includes('/datasources')
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Database className="w-5 h-5" />
                  <span>数据源管理</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>

                <button
                  onClick={() => navigate(`/project/${projectId}/interfaces`)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    location.pathname.includes('/interfaces')
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