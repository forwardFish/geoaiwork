'use client';

import type { ChatMessage } from './ChatMessage';
import type { Pipeline } from '@/lib/pipeline';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Download,
  Eye,
  FileSpreadsheet,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import Papa from 'papaparse';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { planRecipe } from '@/app/actions/planRecipe';
import { DSLCompiler } from '@/lib/dsl-compiler';
import { DuckDBManager } from '@/lib/duckdb';
import { PreviewEngine } from '@/lib/preview-engine';
import { Link } from '@/libs/I18nNavigation';
import {
  createSuccessMessage,
  createWelcomeMessage,
} from '@/utils/messageHelpers';
import ChatMessageComponent from './ChatMessage';

export type ProcessingStep = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
};

export type DataFile = {
  name: string;
  size: number;
  type: string;
  data: any[][];
  headers: string[];
  lastModified: number;
};

export type Recipe = Pipeline & {
  id: string;
  name: string;
  description: string;
  userIntent: string;
  createdAt: Date;
};

export function ToolWorkbench() {
  // Export format state
  const [showExportOptions, setShowExportOptions] = useState(false);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<DataFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [analysisLog] = useState<string[]>([]);
  const [showAnalysisLog, setShowAnalysisLog] = useState(false);
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    createWelcomeMessage(),
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Data processing state
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [previewData, setPreviewData] = useState<any[][] | null>(null);
  const [previewHeaders, setPreviewHeaders] = useState<string[] | null>(null);
  const [previewMode, setPreviewMode] = useState<'original' | 'preview'>('original');
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasGeneratedPreview, setHasGeneratedPreview] = useState(false);
  const [hasAppliedChanges, setHasAppliedChanges] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [duckDBManager] = useState(() => new DuckDBManager());
  const [previewEngine] = useState(() => new PreviewEngine());
  const [isInitialized, setIsInitialized] = useState(false);
  const [originalDataBackup, setOriginalDataBackup] = useState<DataFile | null>(null);

  // Debug state for viewing DuckDB data - REMOVED (not used in production)

  // Debug function to view DuckDB tables - REMOVED (debug functionality disabled)

  // Expose to window for console access - REMOVED (debug functionality disabled)

  // Editable table state - REMOVED (editing functionality disabled)

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize DuckDB when component mounts
  useEffect(() => {
    const initializeDatabases = async () => {
      try {
        await duckDBManager.initialize();
        await previewEngine.initialize();
        setIsInitialized(true);
        console.warn('✅ DuckDB and PreviewEngine initialized');
      } catch (error) {
        console.error('❌ Failed to initialize databases:', error);
      }
    };

    initializeDatabases();

    return () => {
      // Cleanup on unmount
      duckDBManager.cleanup();
      previewEngine.cleanup();
    };
  }, [duckDBManager, previewEngine]);

  // Quick action examples
  const quickActions = [
    'Remove duplicate Customer IDs, keep latest order by date',
    'Split Full Name column into First Name and Last Name',
    'Standardize all dates to YYYY-MM-DD format',
    // 'Merge with another table by Customer ID',
    'Compare two Excel versions for differences',
  ];

  // Helper function to check if operations change column structure - REMOVED (not used)

  // File upload handlers
  const handleFileUpload = useCallback((file: File) => {
    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setUploadError('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    // Real file processing
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let parsedData: string[][] = [];
        let headers: string[] = [];

        if (file.name.toLowerCase().endsWith('.csv')) {
          // Parse CSV file
          const csvResult = Papa.parse(data as string, {
            header: false,
            skipEmptyLines: true,
          });

          if (csvResult.data && csvResult.data.length > 0) {
            const allData = csvResult.data as string[][];
            headers = allData[0] || [];
            parsedData = allData.slice(1);
          }
        } else {
          // Parse Excel file (.xlsx, .xls)
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];

          if (!firstSheetName) {
            setUploadError('Excel file appears to have no sheets');
            setIsUploading(false);
            return;
          }

          const worksheet = workbook.Sheets[firstSheetName];

          if (!worksheet) {
            setUploadError('Unable to read worksheet from Excel file');
            setIsUploading(false);
            return;
          }

          // Convert to array of arrays
          const sheetData: string[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: '',
            raw: false,
          });

          if (sheetData.length > 0) {
            headers = sheetData[0] || [];
            parsedData = sheetData.slice(1);
          }
        }

        // Filter out empty rows
        parsedData = parsedData.filter(row =>
          row.some(cell => cell && cell.toString().trim() !== ''),
        );

        if (headers.length === 0 || parsedData.length === 0) {
          setUploadError('File appears to be empty or has no valid data');
          setIsUploading(false);
          return;
        }

        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          data: parsedData,
          headers,
          lastModified: file.lastModified,
        });

        setChatMessages(prev => [...prev, createSuccessMessage(
          `File "${file.name}" uploaded successfully!`,
          `📊 Data Overview: ${parsedData.length} rows\n📋 Columns: ${headers.join(', ')}\n\nWhat would you like me to do with this data?`,
          {
            rowsBefore: parsedData.length,
            processed: headers.length,
          },
        )]);

        setIsUploading(false);
        setPreviewMode('original');
        setPreviewData(null);
        setHasGeneratedPreview(false);
      } catch (error) {
        console.error('Error parsing file:', error);
        setUploadError('Error parsing file. Please ensure it\'s a valid Excel or CSV file.');
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Error reading file. Please try again.');
      setIsUploading(false);
    };

    // Read file based on type
    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Chat and AI processing - 新的 DSL 流程
  const sendMessage = async () => {
    if (!inputMessage.trim() || isProcessing || !uploadedFile || !isInitialized) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsProcessing(true);

    // Reset preview state when new request is made
    setHasGeneratedPreview(false);
    setHasAppliedChanges(false);
    setPreviewData(null);
    setPreviewHeaders(null);
    setPreviewMode('original');

    try {
      // Step 1: 注册数据到 DuckDB
      const processedData = uploadedFile.data.map((row) => {
        const obj: any = {};
        uploadedFile.headers.forEach((header, index) => {
          const value = row[index] || '';
          obj[header] = value;

          // 调试货币列的原始数据
          if (header && (header.toLowerCase().includes('amount') || header.toLowerCase().includes('price') || header.toLowerCase().includes('cost'))) {
            console.warn(`🔍 [ORIGINAL DATA] ${header}: "${value}" (type: ${typeof value})`);
          }
        });
        return obj;
      });

      console.warn('🔍 Sample processed data:', processedData.slice(0, 2));
      await duckDBManager.registerJSON('a', processedData);

      // Step 2: Intelligently determine if sample data is needed
      const needsSampleData = (query: string): boolean => {
        const lowerQuery = query.toLowerCase();

        // Operations requiring sample data
        const complexOperations = [
          'normalize',
          'standardize',
          'format',
          'clean',
          'dedupe',
          'duplicate',
          'transform',
          'convert',
        ];

        // Simple operations that only need column names
        const simpleOperations = [
          'delete',
          'remove',
          'select',
          'keep',
          'sort',
          'order',
          'drop',
        ];

        const hasComplex = complexOperations.some(op => lowerQuery.includes(op));
        const hasSimple = simpleOperations.some(op => lowerQuery.includes(op));

        // If contains complex operations, sample data is needed
        if (hasComplex) {
          return true;
        }
        // If only contains simple operations, sample data is not needed
        if (hasSimple && !hasComplex) {
          return false;
        }
        // For uncertain cases, send small sample data
        return true;
      };

      const useSampleData = needsSampleData(currentInput);

      // Step 2: Add temporary analysis message
      const tempAnalysisMessageId = Date.now().toString();
      setChatMessages(prev => [...prev, {
        id: tempAnalysisMessageId,
        type: 'ai',
        content: '🤖 Analyzing your request and generating data processing plan...',
        timestamp: new Date(),
        isTemporary: true, // Mark as temporary message
      }]);

      const planResult = await planRecipe({
        userQuery: currentInput,
        colsA: uploadedFile.headers,
        // Intelligently decide sample data amount
        sampleA: useSampleData
          ? uploadedFile.data.slice(0, 3).map((row) => {
              const obj: any = {};
              uploadedFile.headers.forEach((header, index) => {
                obj[header] = row[index] || '';
              });
              return obj;
            })
          : [], // Simple operations don't send sample data
      });

      // Remove temporary message
      setChatMessages(prev => prev.filter(msg => msg.id !== tempAnalysisMessageId));

      if (planResult.kind === 'clarify') {
        // Need clarification case
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'ai',
          content: `🤔 I need some clarification:\n\n${planResult.questions?.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nPlease provide more specific information.`,
          timestamp: new Date(),
        }]);
        setIsProcessing(false);
        return;
      }

      if (planResult.kind === 'invalid') {
        // Validation failed case
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'ai',
          content: `❌ Sorry, I couldn't understand your request. Please try a more specific description.\n\nError details: ${JSON.stringify(planResult.errors)}`,
          timestamp: new Date(),
        }]);
        setIsProcessing(false);
        return;
      }

      // Step 3: DSL generation successful
      const pipeline = planResult.pipeline!;
      const recipe: Recipe = {
        ...pipeline,
        id: Date.now().toString(),
        name: `Processing ${uploadedFile.name}`,
        description: `Based on your request: ${currentInput}`,
        userIntent: currentInput,
        createdAt: new Date(),
      };

      setCurrentRecipe(recipe);

      // 显示生成的方案 - 根据用户输入和生成的步骤个性化回复
      const stepDescriptions = pipeline.steps.map((step, i) => {
        let description = '';
        switch (step.op) {
          case 'normalize':
            description = 'Standardize data format';
            break;
          case 'dedupe':
            description = 'Remove duplicate records';
            break;
          case 'split':
            description = `Split column "${(step as any).column}" into multiple columns`;
            break;
          case 'merge': {
            const mergeStep = step as any;
            const targetColumn = mergeStep.into || mergeStep.newColumn || 'merged_column';
            description = `Merge columns "${mergeStep.columns?.join(', ')}" into "${targetColumn}"`;
            break;
          }
          case 'clean':
            description = 'Clean and organize data';
            break;
          case 'join':
            description = `Join with ${(step as any).rightRef} dataset`;
            break;
          case 'diff':
            description = 'Compare datasets for differences';
            break;
          case 'filter':
            description = 'Filter data based on conditions';
            break;
          case 'sort':
            description = 'Sort data by specified columns';
            break;
          case 'aggregate':
            description = 'Group and summarize data';
            break;
          case 'select': {
            const selectStep = step as any;
            if (selectStep.exclude) {
              description = `Remove columns: ${selectStep.columns.join(', ')}`;
            } else {
              description = `Keep only columns: ${selectStep.columns.join(', ')}`;
            }
            break;
          }
          default:
            description = (step as any).op.toUpperCase();
        }
        return `${i + 1}. ${description}`;
      });

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: `✅ **I understand! You want to "${currentInput}"**\n\nI've created a data processing plan:\n${stepDescriptions.join('\n')}\n\n🔍 Click "Generate Preview" to see exactly what changes will be made to your data.`,
        timestamp: new Date(),
      }]);

      setIsProcessing(false);
    } catch (error) {
      console.error('DSL processing failed:', error);
      // 移除所有临时消息
      setChatMessages(prev => prev.filter(msg => !msg.isTemporary));
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: `❌ An error occurred while processing your request. Please check your network connection or try again later.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      }]);
      setIsProcessing(false);
    }
  };

  const generatePreview = async () => {
    if (!uploadedFile || !currentRecipe || !isInitialized) {
      return;
    }

    setIsExecuting(true);

    try {
      // Backup original data before generating preview
      if (!originalDataBackup) {
        setOriginalDataBackup({ ...uploadedFile });
      }

      // 添加临时预览消息
      const tempPreviewMessageId = Date.now().toString();
      setChatMessages(prev => [...prev, {
        id: tempPreviewMessageId,
        type: 'ai',
        content: '🔍 Generating preview, please wait...',
        timestamp: new Date(),
        isTemporary: true, // 标记为临时消息
      }]);

      // 注册预览引擎数据
      await previewEngine.registerDataset('a', uploadedFile.data.map((row) => {
        const obj: any = {};
        uploadedFile.headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      }));

      // 执行预览
      const preview = await previewEngine.preview(currentRecipe, 2000);
      // 获取预览数据
      const previewSQLs = new DSLCompiler().compileForPreview(currentRecipe, 2000);
      await duckDBManager.executeSequence(previewSQLs);
      // Materialize RESULT to a temp table to avoid DuckDB internal view filter issues
      try {
        await duckDBManager.query('CREATE OR REPLACE TEMP TABLE RESULT AS SELECT * FROM RESULT');
      } catch {}
      const resultData = await duckDBManager.exportToJSON('SELECT * FROM RESULT LIMIT 1000');

      // 调试 DuckDB Return的原始数据
      console.warn('🔍 [DUCKDB RESULT] Sample resultData:', resultData.slice(0, 2));
      if (resultData.length > 0) {
        const firstRow = resultData[0];
        Object.keys(firstRow).forEach((key) => {
          if (key && (key.toLowerCase().includes('amount') || key.toLowerCase().includes('price') || key.toLowerCase().includes('cost'))) {
            console.warn(`🔍 [DUCKDB RESULT] ${key}: ${firstRow[key]} (type: ${typeof firstRow[key]})`);
          }
        });
      }

      // 转换回二维数组格式以兼容现有UI
      // 注意：需要使用实际结果中的列，而不是原始文件的列
      let actualHeaders: string[] = [];
      if (resultData.length > 0) {
        actualHeaders = Object.keys(resultData[0]);
      }

      const previewArray = resultData.map((row, rowIndex) => {
        const mappedRow = actualHeaders.map((header) => {
          const value = row[header] || '';

          // 调试货币数据转换
          if (header && (header.toLowerCase().includes('amount') || header.toLowerCase().includes('price') || header.toLowerCase().includes('cost'))) {
            console.warn(`🔍 [PREVIEW ARRAY] Row ${rowIndex}, ${header}: Raw DuckDB value = ${value} (type: ${typeof value})`);
          }

          return value;
        });
        return mappedRow;
      });

      setPreviewData(previewArray);
      setPreviewHeaders(actualHeaders); // 设置预览的headers
      setPreviewMode('preview');
      setHasGeneratedPreview(true);

      // 移除临时消息并显示结果
      setChatMessages(prev => prev.filter(msg => msg.id !== tempPreviewMessageId));
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: `👁️ **Preview generated successfully!**\n\n📈 **Changes summary:**\n• Original data: ${preview.rowsBefore} rows\n• After processing: ${preview.rowsAfter} rows\n• Added: ${preview.summary.added} rows\n• Removed: ${preview.summary.removed} rows\n• Modified: ${preview.summary.modified} rows\n\n${preview.risks.length > 0 ? `⚠️ **Important notes:**\n${preview.risks.join('\n')}\n\n` : ''}Please review the preview in the data panel on the right. If you're satisfied, click "Apply Changes".`,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Preview generation failed:', error);
      // 移除临时消息
      setChatMessages(prev => prev.filter(msg => !msg.isTemporary));

      // 提供友好的ErrorTip
      let errorMessage = 'Preview generation failed';
      let suggestion = '';

      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase();

        if (errorStr.includes('column') && errorStr.includes('not found')) {
          // 列名Error
          errorMessage = 'Column name error';
          suggestion = 'Please check if the column names in your request match the actual column names in your data.';
        } else if (errorStr.includes('syntax error')) {
          // SQL语法Error
          errorMessage = 'Data processing syntax error';
          suggestion = 'The operation you requested may be too complex. Try simplifying your request.';
        } else if (errorStr.includes('type') || errorStr.includes('cast')) {
          // 数据类型Error
          errorMessage = 'Data type mismatch';
          suggestion = 'The data in some columns cannot be processed as expected. Check if the data format is correct.';
        } else {
          // 通用Error
          errorMessage = 'Processing failed';
          suggestion = 'Try a simpler operation or check your data format.';
        }
      }

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: `❌ **${errorMessage}**\n\n${suggestion}\n\n💡 **Tips:**\n• Make sure column names are spelled correctly\n• Check if your data contains the expected values\n• Try processing one operation at a time\n\nTechnical details: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      }]);
    }

    setIsExecuting(false);
  };

  const undoChanges = () => {
    if (!originalDataBackup) {
      return;
    }

    // Restore the original data
    setUploadedFile(originalDataBackup);
    setPreviewData(null);
    setPreviewHeaders(null);
    setPreviewMode('original');
    setHasGeneratedPreview(false);
    setHasAppliedChanges(false);
    setCurrentRecipe(null);
    setShowRecipeDetails(false);
    setOriginalDataBackup(null);

    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'ai',
      content: `↩️ **Changes cancelled successfully!**\n\nYour data has been restored to its original state. You can now try a different operation or export the original data.`,
      timestamp: new Date(),
    }]);
  };

  const applyChanges = async () => {
    if (!previewData || !uploadedFile || !currentRecipe) {
      return;
    }

    setIsExecuting(true);

    try {
      // 执行完整的数据处理
      const compiler = new DSLCompiler();
      const fullSQLs = compiler.compile(currentRecipe);
      await duckDBManager.executeSequence(fullSQLs);

      // 获取最终结果
      const finalData = await duckDBManager.exportToJSON('SELECT * FROM RESULT');

      // 使用实际结果中的列，而不是原始文件的列
      let finalHeaders: string[] = [];
      if (finalData.length > 0) {
        finalHeaders = Object.keys(finalData[0]);
      }

      const finalArray = finalData.map(row =>
        finalHeaders.map(header => row[header] || ''),
      );

      // 更新原始数据和headers
      setUploadedFile(prev => prev ? {
        ...prev,
        data: finalArray,
        headers: finalHeaders, // 更新headers以反映结构变化
      } : null);

      setPreviewData(null);
      setPreviewHeaders(null); // 清理预览headers
      setPreviewMode('original');
      setIsExecuting(false);
      setHasGeneratedPreview(false);
      setHasAppliedChanges(true); // 标记已应用更改
      setCurrentRecipe(null); // 清理当前recipe，隐藏Show Recipe和Generate Previewby钮
      setShowRecipeDetails(false); // 隐藏recipe详情

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: `✅ **Changes applied successfully!**\n\nYour data has been updated. You can now export the results or perform other operations.\n\n📥 Click "Export Data" to download the processed file.`,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Apply changes failed:', error);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: `❌ Failed to apply changes: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      }]);
      setIsExecuting(false);
    }
  };

  const exportData = async (format?: 'csv' | 'excel' | 'json') => {
    // Allow exporting whenever a file is loaded and DB is initialized
    if (!uploadedFile) {
      return;
    }

    const exportFormat = format || 'csv'; // Default to CSV

    try {
      // Export processed data
      if (duckDBManager.isInitialized) {
        // Get latest data from DuckDB
        const latestData = await duckDBManager.exportToJSON('SELECT * FROM RESULT');

        if (exportFormat === 'csv') {
          const csvData = await duckDBManager.exportToCSV('SELECT * FROM RESULT');
          if (csvData) {
            // Add UTF-8 BOM for proper Chinese character encoding
            const csvWithBOM = `\uFEFF${csvData}`;
            const csvBlob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' });
            const csvUrl = URL.createObjectURL(csvBlob);
            const csvLink = document.createElement('a');
            csvLink.href = csvUrl;
            csvLink.download = `${uploadedFile.name.split('.')[0]}_processed.csv`;
            document.body.appendChild(csvLink);
            csvLink.click();
            document.body.removeChild(csvLink);
            URL.revokeObjectURL(csvUrl);
          }
        } else if (exportFormat === 'excel') {
          // Export as Excel with formatting preserved
          const worksheet = XLSX.utils.json_to_sheet(latestData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Processed Data');

          // Apply number formatting for dates and currency
          const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
          for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
              const cell = worksheet[cellAddress];
              if (cell) {
                // Check if it's a date column
                const colName = Object.keys(latestData[0])[C];
                if (colName && colName.toLowerCase().includes('date')) {
                  cell.z = 'yyyy-mm-dd';
                }
                // Check if it's a currency column
                if (colName && colName.toLowerCase().includes('amount')) {
                  cell.z = '$#,##0.00';
                }
              }
            }
          }

          XLSX.writeFile(workbook, `${uploadedFile.name.split('.')[0]}_processed.xlsx`);
        } else if (exportFormat === 'json') {
          // Export as JSON
          const jsonStr = JSON.stringify(latestData, null, 2);
          const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = `${uploadedFile.name.split('.')[0]}_processed.json`;
          document.body.appendChild(jsonLink);
          jsonLink.click();
          document.body.removeChild(jsonLink);
          URL.revokeObjectURL(jsonUrl);
        }
      }

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: `📥 **Export completed!**\n\nYour processed data has been downloaded as:\n• 📊 **${uploadedFile.name.split('.')[0]}_processed.${exportFormat}**\n\nThe file contains all your data transformations and is ready to use.`,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Export failed:', error);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: `❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      }]);
    }
  };

  // Helper function to detect and format date & currency values
  const formatCellValue = (value: any, columnName: string): string => {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    // Currency column detection (broadened keywords)
    const lowerName = (columnName || '').toLowerCase();
    const currencyKeywords = ['amount', 'price', 'cost', 'total', 'subtotal', 'balance', 'revenue', 'income', 'payment', 'payout', 'fee', 'tax', 'charge'];
    const isCurrencyColumn = currencyKeywords.some(k => lowerName.includes(k));

    // Debug logging for currency values
    if (isCurrencyColumn) {
      // console.warn(`🔍 Currency value debug - Column: ${columnName}, Value: ${value}, Type: ${typeof value}, StringValue: "${stringValue}"`);
    }

    // Special handling for currency columns - don't apply timestamp conversion
    if (isCurrencyColumn) {
      // For currency columns, format as number with 2 decimal places
      // console.warn(`🔍 Currency processing - Raw value: "${value}", Type: ${typeof value}`);
      const numValue = Number(value);
      if (!Number.isNaN(numValue)) {
        const formatted = numValue.toFixed(2);
        // console.warn(`🔍 Currency formatted: ${value} → ${formatted} (numValue: ${numValue})`);
        return formatted;
      }
      // console.warn(`🔍 Currency conversion failed, returning original: "${stringValue}"`);
      return stringValue;
    }

    // Check if this looks like a timestamp (all digits, length 10-13) - but NOT for currency columns
    if (/^\d{10,13}$/.test(stringValue)) {
      const numValue = Number.parseInt(stringValue);

      // Convert timestamps to readable dates
      if (numValue > 1000000000000) {
        // Milliseconds timestamp
        const date = new Date(numValue);
        return date.toISOString().split('T')[0] || ''; // YYYY-MM-DD format
      } else if (numValue > 1000000000) {
        // Seconds timestamp
        const date = new Date(numValue * 1000);
        return date.toISOString().split('T')[0] || ''; // YYYY-MM-DD format
      } else if (numValue > 1000) {
        // Days since epoch
        const date = new Date('1970-01-01');
        date.setDate(date.getDate() + numValue);
        return date.toISOString().split('T')[0] || ''; // YYYY-MM-DD format
      }
    }

    // Check if it's already a properly formatted date
    if (/^\d{4}-\d{2}-\d{2}/.test(stringValue)) {
      return stringValue;
    }

    // For date-like column names, try to parse common date formats
    if (columnName && (columnName.toLowerCase().includes('date') || columnName.toLowerCase().includes('time'))) {
      // Try parsing common date formats
      const datePatterns = [
        /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, // 2025/07/01
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // 07/01/2025
        /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/, // 2025.07.01
        /^(\w{3})\s+(\d{1,2}),\s+(\d{4})$/, // Jul 2, 2025
      ];

      for (const pattern of datePatterns) {
        if (pattern.test(stringValue)) {
          try {
            const date = new Date(stringValue);
            if (!Number.isNaN(date.getTime())) {
              return date.toISOString().split('T')[0] || ''; // YYYY-MM-DD format
            }
          } catch {
            // Continue to next pattern
          }
        }
      }
    }

    return stringValue;
  };

  const resetTool = () => {
    setUploadedFile(null);
    setPreviewData(null);
    setPreviewHeaders(null); // 清理预览headers
    setPreviewMode('original');
    setHasGeneratedPreview(false);
    setHasAppliedChanges(false);
    setProcessingSteps([]);
    setCurrentRecipe(null);
    setShowRecipeDetails(false);
    setIsProcessing(false);
    setIsExecuting(false);
    setOriginalDataBackup(null); // Clear the backup data
    // Editing state removed
    setChatMessages([{
      id: Date.now().toString(),
      type: 'system',
      content: '👋 Welcome to GeoAIWork! Upload a website URL to get started, then describe what GEO optimizations you want to analyze.',
      timestamp: new Date(),
    }]);
    setInputMessage('');
    setUploadError('');
  };

  const insertQuickAction = (action: string) => {
    setInputMessage(action);
  };

  // Editable table functions - REMOVED (editing functionality disabled)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                GeoAIWork
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                GEO Analysis Workbench
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="hidden items-center gap-4 text-sm text-gray-600 md:flex dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className={uploadedFile ? 'text-green-600' : 'text-gray-400'}>
                ① Upload File
              </span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
              <span className={chatMessages.some(m => m.type === 'user') ? 'text-green-600' : 'text-gray-400'}>
                ② Describe Task
              </span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
              <span className={hasGeneratedPreview ? 'text-green-600' : 'text-gray-400'}>
                ③ Preview Changes
              </span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
              <span className="text-gray-400">④ Export Result</span>
            </div>

            {/* AI Status Indicator */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>

            <button
              onClick={resetTool}
              className="group relative flex transform items-center gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-6 py-3 font-medium text-red-600 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-red-300 hover:from-red-100 hover:to-orange-100 hover:text-red-700 hover:shadow-md active:scale-[0.98] dark:border-red-800 dark:from-red-950/20 dark:to-orange-950/20 dark:text-red-400 dark:hover:border-red-700 dark:hover:from-red-950/40 dark:hover:to-orange-950/40 dark:hover:text-red-300"
            >
              <div className="relative">
                <Trash2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
                <div className="absolute -inset-1 -z-10 rounded-full bg-red-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-red-900/30"></div>
              </div>
              <span className="font-semibold tracking-wide">Reset All</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400/10 to-orange-400/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
            </button>
          </div>
        </div>

        {/* Main Content - Dual Panel Layout */}
        <div className="flex h-[calc(100vh-80px)]">

          {/* Left Panel - Chat Interface (45%) */}
          <div className="flex max-h-[calc(100vh-80px)] w-[45%] flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">

            {/* Chat Header */}
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  AI Assistant
                </h2>
                {isProcessing && (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
                    Processing...
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              <AnimatePresence>
                {chatMessages.map((message, index) => (
                  <ChatMessageComponent
                    key={message.id}
                    message={message}
                    isLatest={index === chatMessages.length - 1}
                  />
                ))}
              </AnimatePresence>

              {/* Recipe Details and Action Buttons */}
              {!isProcessing && uploadedFile && currentRecipe && !hasGeneratedPreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => setShowRecipeDetails(!showRecipeDetails)}
                      className="flex items-center gap-2 rounded-lg bg-gray-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      {showRecipeDetails ? 'Hide Recipe' : 'Show Recipe'}
                    </button>
                    <button
                      onClick={generatePreview}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      Generate Preview
                    </button>
                  </div>

                  {/* Recipe Details Expansion */}
                  <AnimatePresence>
                    {showRecipeDetails && currentRecipe && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-700"
                      >
                        <div className="mb-2 font-medium text-gray-900 dark:text-white">
                          📋 Recipe DSL Configuration:
                        </div>
                        <pre className="overflow-x-auto text-xs text-gray-600 dark:text-gray-300">
                          {JSON.stringify({
                            operation: currentRecipe.name,
                            steps: currentRecipe.steps,
                          }, null, 2)}
                        </pre>
                        <div className="mt-2 text-xs text-gray-500">
                          This configuration will be saved as pipeline.json for reuse
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {hasGeneratedPreview && !isExecuting && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={undoChanges}
                      className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Cancel Changes
                    </button>
                    <button
                      onClick={applyChanges}
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Apply Changes
                    </button>
                    <button
                      onClick={() => setShowExportOptions(!showExportOptions)}
                      className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </button>
                  </div>

                  {/* Export Format Options */}
                  <AnimatePresence>
                    {showExportOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center"
                      >
                        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                          <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                            Select export format:
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                exportData('csv');
                                setShowExportOptions(false);
                              }}
                              className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                              📄 CSV
                            </button>
                            <button
                              onClick={() => {
                                exportData('excel');
                                setShowExportOptions(false);
                              }}
                              className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                              📈 Excel
                            </button>
                            <button
                              onClick={() => {
                                exportData('json');
                                setShowExportOptions(false);
                              }}
                              className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                              🔧 JSON
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Show Export button after Apply Changes */}
              {hasAppliedChanges && !isExecuting && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowExportOptions(!showExportOptions)}
                      className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </button>
                  </div>

                  {/* Export Format Options */}
                  <AnimatePresence>
                    {showExportOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-center"
                      >
                        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                          <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                            Select export format:
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                exportData('csv');
                                setShowExportOptions(false);
                              }}
                              className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                              📄 CSV
                            </button>
                            <button
                              onClick={() => {
                                exportData('excel');
                                setShowExportOptions(false);
                              }}
                              className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                              📈 Excel
                            </button>
                            <button
                              onClick={() => {
                                exportData('json');
                                setShowExportOptions(false);
                              }}
                              className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                              🔧 JSON
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {isExecuting && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="h-4 w-4 animate-spin rounded-full border border-blue-500 border-t-transparent"></div>
                    {hasGeneratedPreview ? 'Applying changes...' : 'Generating preview...'}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions - Hidden to avoid duplication */}
            {false && !uploadedFile && !isUploading && (
              <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  💡 What you can do:
                </div>
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => insertQuickAction(action)}
                      className="w-full rounded bg-gray-50 p-2 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      •
                      {' '}
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Analysis Debug Panel */}
            <AnimatePresence>
              {showAnalysisLog && analysisLog.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        🤖 AI Analysis Process
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (auto-hiding in 3s)
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowAnalysisLog(false);
                        if (autoHideTimer) {
                          clearTimeout(autoHideTimer);
                          setAutoHideTimer(null);
                        }
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="max-h-32 space-y-1 overflow-y-auto text-xs">
                    {analysisLog.map((log, index) => (
                      <div key={index} className="text-gray-600 dark:text-gray-300">
                        {log}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={uploadedFile ? 'Describe what you want to do...' : 'Upload a file first to get started...'}
                  disabled={!uploadedFile || isProcessing}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || !uploadedFile || isProcessing}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {processingSteps.length > 0 && (
                <div className="mt-3">
                  <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    Processing Steps:
                  </div>
                  {processingSteps.map(step => (
                    <div key={step.id} className="mb-1 flex items-center gap-2 text-xs">
                      {step.status === 'completed'
                        ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )
                        : step.status === 'processing'
                          ? (
                              <div className="h-3 w-3 animate-spin rounded-full border border-blue-500 border-t-transparent" />
                            )
                          : (
                              <div className="h-3 w-3 rounded-full border border-gray-300" />
                            )}
                      <span className="text-gray-700 dark:text-gray-300">{step.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Data Preview (55%) */}
          <div className="flex max-h-[calc(100vh-80px)] w-[55%] flex-col bg-gray-50 dark:bg-gray-900">

            {/* Data Panel Header */}
            <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-gray-600" />
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {uploadedFile ? uploadedFile.name : 'Data Preview'}
                  </h2>
                  {uploadedFile && (
                    <span className="text-sm text-gray-500">
                      {uploadedFile.data.length}
                      {' '}
                      rows •
                      {uploadedFile.headers.length}
                      {' '}
                      columns
                    </span>
                  )}
                </div>

                {/* Dynamic Action Bar - Smart Context-Aware Design */}
                <div className="flex items-center gap-3">
                  {previewData ? (
                  /* Enhanced Preview Mode Toggle */
                    <div className="relative inline-flex items-center rounded-xl bg-gray-100 p-1 dark:bg-gray-700">
                      <button
                        onClick={() => setPreviewMode('original')}
                        className={`relative z-10 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                          previewMode === 'original'
                            ? 'bg-white text-blue-600 shadow-md dark:bg-gray-800 dark:text-blue-400'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        Original Data
                        {previewMode === 'original' && (
                          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500"></div>
                        )}
                      </button>
                      <button
                        onClick={() => setPreviewMode('preview')}
                        className={`relative z-10 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                          previewMode === 'preview'
                            ? 'bg-white text-green-600 shadow-md dark:bg-gray-800 dark:text-green-400'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                      >
                        <Eye className="h-4 w-4" />
                        Preview Changes
                        {previewMode === 'preview' && (
                          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></div>
                        )}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* File Upload Area or Data Table */}
            {!uploadedFile ? (
              <div className="flex flex-1 items-center justify-center p-8">
                <div
                  className={`w-full max-w-lg cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                    dragOver
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading
                    ? (
                        <div className="space-y-4">
                          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                          <p className="text-gray-600 dark:text-gray-400">Processing file...</p>
                        </div>
                      )
                    : (
                        <div className="space-y-4">
                          <Upload className="mx-auto h-16 w-16 text-gray-400" />
                          <div>
                            <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                              Upload Excel or CSV File
                            </p>
                            <p className="mb-4 text-gray-600 dark:text-gray-400">
                              Drag and drop your file here, or click to browse
                            </p>
                            <div className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
                              <Upload className="h-4 w-4" />
                              Choose File
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                              Supports: .xlsx, .xls, .csv (Max 10MB)
                            </p>
                            {uploadError && (
                              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/30">
                                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-sm">{uploadError}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
            /* Data Table */
              <div className="relative flex-1 overflow-hidden p-4">
                <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <div className="w-full flex-1 overflow-auto">
                    <div className="min-w-0">
                      <table className="w-full table-fixed">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                          <tr>
                            {(previewMode === 'preview' && previewHeaders ? previewHeaders : uploadedFile.headers).map((header, index) => (
                              <th key={index} className="w-40 min-w-[10rem] truncate border-r border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900 last:border-r-0 dark:border-gray-600 dark:text-white" title={header}>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(previewMode === 'preview' && previewData ? previewData : uploadedFile.data).map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="group border-t border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50"
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="w-40 min-w-[10rem] truncate border-r border-gray-200 px-4 py-3 text-sm text-gray-900 last:border-r-0 dark:border-gray-600 dark:text-white"
                                  title={formatCellValue(cell, (previewMode === 'preview' && previewHeaders ? previewHeaders : uploadedFile.headers)?.[cellIndex] || '') || ''}
                                >
                                  {formatCellValue(cell, (previewMode === 'preview' && previewHeaders ? previewHeaders : uploadedFile.headers)?.[cellIndex] || '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
