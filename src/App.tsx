import { useState } from 'react';
import { Upload, History } from 'lucide-react';
import FolderUploader from './components/FolderUploader';
import UploadHistory from './components/UploadHistory';

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">文件夹上传工具</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'upload' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('upload')}
              >
                <Upload size={16} className="mr-2" />
                上传
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'history' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('history')}
              >
                <History size={16} className="mr-2" />
                历史
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' ? <FolderUploader /> : <UploadHistory />}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            文件夹上传工具 &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;