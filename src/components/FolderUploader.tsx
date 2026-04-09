import { useState, useRef } from 'react';
import { Upload, Folder, File, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface FileWithPath {
  file: File;
  relativePath: string;
}

const FolderUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const fileArray: FileWithPath[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      fileArray.push({
        file,
        relativePath: (file as any).webkitRelativePath || file.name
      });
    }
    setFiles(fileArray);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    try {
      const totalFiles = files.length;
      let uploadedFiles = 0;

      // 创建上传记录
      const { data: uploadRecord, error: uploadError } = await supabase
        .from('uploads')
        .insert({
          name: 'Uploaded Folder',
          file_count: totalFiles,
          total_size: files.reduce((sum, item) => sum + item.file.size, 0)
        })
        .select('id')
        .single();

      if (uploadError) throw uploadError;

      // 上传文件
      for (const item of files) {
        const { error: uploadFileError } = await supabase
          .storage
          .from('files')
          .upload(item.relativePath, item.file);

        if (uploadFileError) throw uploadFileError;

        // 记录文件信息
        await supabase
          .from('upload_files')
          .insert({
            upload_id: uploadRecord.id,
            file_path: item.relativePath,
            file_name: item.file.name,
            file_size: item.file.size,
            content_type: item.file.type
          });

        uploadedFiles++;
        setUploadProgress((uploadedFiles / totalFiles) * 100);
      }

      setUploadStatus('success');
      setTimeout(() => {
        setFiles([]);
        setUploadProgress(0);
        setUploadStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('上传失败，请重试');
      setUploadStatus('error');
    }
  };

  const renderFileList = () => {
    // 构建文件结构
    const structure: any = {};

    files.forEach(item => {
      const parts = item.relativePath.split('/');
      let current = structure;

      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i];
        if (!current[folderName]) {
          current[folderName] = { files: [], folders: {} };
        }
        current = current[folderName].folders;
      }

      const fileName = parts[parts.length - 1];
      if (!current.files) current.files = [];
      current.files.push({
        name: fileName,
        size: item.file.size,
        path: item.relativePath
      });
    });

    const renderStructure = (obj: any, level: number = 0) => {
      const indent = level * 20;
      const elements: JSX.Element[] = [];

      Object.entries(obj).forEach(([key, value]) => {
        if (key === 'files' && Array.isArray(value)) {
          value.forEach((file: any) => {
            elements.push(
              <div key={file.path} style={{ marginLeft: indent }} className="flex items-center py-1">
                <File size={14} className="text-gray-500 mr-2" />
                <span>{file.name}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            );
          });
        } else if (typeof value === 'object' && value !== null) {
          const folderValue = value as { folders?: any; files?: any };
          elements.push(
            <div key={key}>
              <div style={{ marginLeft: indent }} className="flex items-center py-1">
                <Folder size={16} className="text-blue-500 mr-2" />
                <span className="font-medium">{key}</span>
              </div>
            </div>
          );
          if (folderValue.folders) {
            elements.push(...renderStructure(folderValue.folders, level + 1));
          }
          if (folderValue.files && Array.isArray(folderValue.files)) {
            elements.push(...renderStructure({ files: folderValue.files }, level + 1));
          }
        }
      });

      return elements;
    };

    return renderStructure(structure);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">文件夹上传</h1>
      
      {/* 上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-all ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          multiple
          {...{ webkitdirectory: '' } as any}
          {...{ directory: '' } as any}
        />
        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-lg font-semibold mb-2">拖放文件夹到此处</h2>
        <p className="text-gray-500 mb-4">或点击选择文件夹</p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={handleClick}
        >
          选择文件夹
        </button>
      </div>

      {/* 文件结构预览 */}
      {files.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">文件结构预览</h2>
          <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
            {renderFileList()}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              onClick={handleUpload}
              disabled={uploadStatus === 'uploading'}
            >
              开始上传 ({files.length} 个文件)
            </button>
          </div>
        </div>
      )}

      {/* 上传进度 */}
      {uploadStatus === 'uploading' && (
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span>上传中...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 上传状态 */}
      {uploadStatus === 'success' && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle size={24} className="text-green-500 mr-3" />
          <span>上传成功！</span>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle size={24} className="text-red-500 mr-3" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FolderUploader;