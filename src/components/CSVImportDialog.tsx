import { useState } from "react";
import Papa from "papaparse";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Upload, FileText, Download, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@utils/utils";

type CSVRowData = Record<string, string | number | boolean>;
type FieldMapping = Record<string, string>;
type ImportStatus = 'idle' | 'loading' | 'success' | 'error';

interface CSVImportDialogProps {
  title: string;
  templateFields: string[];
  sampleData: CSVRowData[];
  onImport: (data: CSVRowData[]) => void;
  trigger: React.ReactNode;
}

interface CSVParseError {
  type: string;
  code: string;
  message: string;
  row?: number;
}

export const CSVImportDialog = ({ title, templateFields, sampleData, onImport, trigger }: CSVImportDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRowData[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [parseErrors, setParseErrors] = useState<CSVParseError[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File): void => {
    if (!file.name.toLocaleLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    setUploadedFile(file);
    setImportStatus('loading');
    setParseErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      delimitersToGuess: [',', '\t', '|', ';'],
      complete: (results) => {
        const errors = results.errors as CSVParseError[];

        if (errors.length > 0) {
          setParseErrors(errors);
          console.warn('CSV parsing errors:', errors);
        }

        // Clean and process headers
        const headers = results.meta.fields || [];
        const cleanHeaders = headers.map(header =>
          header.toString().trim().replace(/\s+/g, ' ')
        );

        setCsvHeaders(cleanHeaders);
        setCsvData(results.data as CSVRowData[]);

        // Auto-map fields based on similarity
        const autoMapping: FieldMapping = {};
        templateFields.forEach(templateField => {
          const normalizedTemplate = templateField.toLowerCase().replace(/[^a-z0-9]/g, '');

          const matchingHeader = cleanHeaders.find(header => {
            const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedHeader === normalizedTemplate ||
              normalizedHeader.includes(normalizedTemplate) ||
              normalizedTemplate.includes(normalizedHeader);
          });

          if (matchingHeader) {
            autoMapping[templateField] = matchingHeader;
          }
        });

        setFieldMapping(autoMapping);
        setImportStatus('idle');
        setStep(2);
      },
      error: (error) => {
        console.error('CSV parsing failed:', error);
        setImportStatus('error');
        setParseErrors([{
          type: 'ParseError',
          code: 'PARSE_FAILED',
          message: error.message
        }]);
      }
    });
  };



  const downloadTemplate = (): void => {
    const csvContent = templateFields.join(",") + "\n" + 
      sampleData.map(row => 
        templateFields.map(field => {
          const value = row[field];
          // Handle values that contain commas by wrapping in quotes
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value || "";
        }).join(",")
      ).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFieldMappingChange = (templateField: string, csvHeader: string): void => {
    setFieldMapping(prev => ({
      ...prev,
      [templateField]: csvHeader === 'none' ? '' : csvHeader
    }));
  };

  const transformData = (): CSVRowData[] => {
    return csvData.map(row => {
      const transformedRow: CSVRowData = {};
      
      Object.entries(fieldMapping).forEach(([templateField, csvHeader]) => {
        if (csvHeader && row[csvHeader] !== undefined && row[csvHeader] !== null) {
          let value = row[csvHeader];
          
          // Clean up string values
          if (typeof value === 'string') {
            value = value.toString().trim();
          }
          
          transformedRow[templateField] = value;
        }
      });
      
      return transformedRow;
    }).filter(row => Object.keys(row).length > 0); // Filter out empty rows
  };

 const handleImport = (): void => {
    try {
      setImportStatus('loading');
      const transformedData = transformData();
      
      if (transformedData.length === 0) {
        throw new Error('No valid data to import. Please check your field mappings.');
      }
      
      onImport(transformedData);
      setImportStatus('success');
      setStep(4);
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
      setStep(4);
    }
  };

  const resetDialog = (): void => {
    setStep(1);
    setUploadedFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setFieldMapping({});
    setImportStatus('idle');
    setParseErrors([]);
    setOpen(false);
  };

  const previewData = transformData();
  const validMappings = Object.values(fieldMapping).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import {title}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <Button onClick={downloadTemplate} variant="outline" className="mb-4">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <p className="text-sm text-muted-foreground">
                Download the template to see the required format
              </p>
            </div>

            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
                id="csv-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="csv-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Field Mapping</h3>
              <Badge variant="secondary">{uploadedFile?.name}</Badge>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Map your CSV columns to system fields:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {templateFields.map((field) => (
                    <div key={field} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{field}</span>
                      <Badge variant="outline">Auto-mapped</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={() => setStep(1)} variant="outline">Back</Button>
              <Button onClick={() => setStep(3)}>Preview Data</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Preview Import</h3>
              <Badge>{csvData.length} records found</Badge>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {templateFields.map((field) => (
                        <TableHead key={field}>{field}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.slice(0, 5).map((row, index) => (
                      <TableRow key={index}>
                        {templateFields.map((field) => (
                          <TableCell key={field}>{row[field] || "-"}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={() => setStep(2)} variant="outline">Back</Button>
              <Button onClick={handleImport}>Import {csvData.length} Records</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6">
            {importStatus === 'success' ? (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                <h3 className="text-xl font-medium">Import Successful!</h3>
                <p className="text-muted-foreground">
                  Successfully imported {csvData.length} records
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
                <h3 className="text-xl font-medium">Import Failed</h3>
                <p className="text-muted-foreground">
                  There was an error importing your data. Please try again.
                </p>
              </div>
            )}
            <Button onClick={resetDialog}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};