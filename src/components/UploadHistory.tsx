import { useState, useEffect } from 'react';
import { Clock, Folder, File, Download, Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface Upload {
  id: string;
  name: string;
  file_count: number;
  total_size: number;
  created_at: string;
}

interface UploadFile {
  id: string;
  upload_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  content_type: string;
}

const UploadHistory = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadFiles = async (uploadId: string) => {
    try {
      const { data, error } = await supabase
        .from('upload_files')
        .select('*')
        .eq('upload_id', uploadId);

      if (error) throw error;
      setUploadFiles(data || []);
    } catch (error) {
      console.error('Error fetching upload files:', error);
    }
  };

  const handleUploadClick = (upload: Upload) => {
    setSelectedUpload(upload);
    fetchUploadFiles(upload.id);
  };

  const handleDownloadFile = async (file: UploadFile) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('files')
        .download(file.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const formatSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">上传历史</h1>

      {/* 上传历史列表 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">上传记录</h2>
        <div className="space-y-4">
          {uploads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无上传记录
            </div>
          ) : (
            uploads.map(upload => (
              <div
                key={upload.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedUpload?.id === upload.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => handleUploadClick(upload)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Folder size={20} className="text-blue-500 mr-3" />
                    <div>
                      <h3 className="font-medium">{upload.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock size={14} className="mr-1" />
                        <span>{formatDate(upload.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{upload.file_count} 个文件</div>
                    <div className="text-sm font-medium">{formatSize(upload.total_size)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 选中的上传文件列表 */}
      {selectedUpload && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {selectedUpload.name} - 文件列表
          </h2>
          <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
            {uploadFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无文件
              </div>
            ) : (
              uploadFiles.map(file => (
                <div key={file.id} className="flex items-center py-2 border-b last:border-b-0">
                  <File size={16} className="text-gray-500 mr-3" />
                  <span className="flex-1">{file.file_name}</span>
                  <span className="text-sm text-gray-500 mr-4">{formatSize(file.file_size)}</span>
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile(file);
                    }}
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadHistory;