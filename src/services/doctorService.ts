import apiClient from '@/api/axiosConfig';
import { importDoctors } from '@api/doctorApi';
import {getDoctors} from '@api/adminApi'

export interface DoctorCSVRow {
  [key: string]: string;
}

export interface MappedDoctor {
  doctor_email: string;
  doctor_name: string;
  specialization: string;
  phone: string;
  license_number: string;
  degree: string | null;
  doctor_address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  is_available: boolean;
  year_of_experience: string | null;
}

export interface MappedDoctorTwo {
  id: string;
  doctorId: string;
  doctorName: string;
  gender: string;
  degree: string;
  doctorAddress: string;
  phone: string;
  joinDate: string; 
  dateOfBirth: string;
  yearOfExperience: number;
  about: string;
  licenseNumber: string;
  available: boolean;
  active: boolean;
  specialization: string;
  totalPatients: number;
  todayAppointments: number;
  doctorEmail?: string; 
  imageProfile: string;
}

// UI Doctor interface (what your JSX expects)
export interface UIDoctorData {
  id: string;
  name: string;
  department: string;
  specialist: string;
  totalPatients: number;
  todayAppointments: number;
  status: "Available" | "Unavailable";
  avatar: string;
  phone: string;
  email: string;
  degree: string;
  experience: number;
  about: string;
  address: string;
  joinDate: string;
  imageProfile: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
  licenseNumber?: string;
}

export interface ImportOptions {
  updateExisting?: boolean;
  skipDuplicates?: boolean;
  validateOnly?: boolean;
}

// A summary of the import operation's results.
export interface ImportSummary {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
}

// Details about a specific row that failed to import.
export interface ImportError {
  data: MappedDoctor; // The doctor data that caused the error
  errors: string[];   // The specific validation messages for this row
}

// The expected successful response structure from the `importDoctors` API call.
interface ApiImportResponse {
  summary: ImportSummary;
  errors?: ImportError[];
  duplicates?: MappedDoctor[];
}

export interface PaginatedDoctors {
  doctors: MappedDoctorTwo[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ImportResult {
  success: boolean;
  message: string;
  summary?: ImportSummary;
  errors?: ImportError[];
  duplicates?: MappedDoctor[];
}

export class DoctorService {
  static mapCSVRow(row: DoctorCSVRow): MappedDoctor {
    return {
      doctor_email: row['Email']?.trim() || '',
      doctor_name: row['Name']?.trim() || '',
      specialization: row['Specialization']?.trim() || '',
      phone: row['Phone']?.toString().trim() || '',
      license_number: row['License Number']?.trim() || '',
      degree: row['Degree']?.trim() || null,
      doctor_address: row['Address']?.trim() || null,
      date_of_birth: row['Date of Birth']?.trim() || null,
      gender: row['Gender']?.trim() || null,
      is_available: String(row['Is Available'] ?? '').toLowerCase().trim() === 'true',
      year_of_experience: row['Year Of Experience']?.trim() || null,
    };
  }

  static async importFromCSV(
    csvData: DoctorCSVRow[],
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    const mappedDoctors = csvData.map(this.mapCSVRow);

    try {
      // Assuming `importDoctors` returns a promise resolving to `ApiImportResponse`
      const result: ApiImportResponse = await importDoctors(mappedDoctors, options);

      return {
        success: true,
        message: 'Import successful',
        summary: result.summary,
        errors: result.errors || [],
        duplicates: result.duplicates || [],
      };
    } catch (error: unknown) {
      // Use `unknown` for type safety in catch blocks and perform a type check.
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred during import.',
      };
    }
  }

  static async getAllDoctors(
  page = 0,
  size = 10,
  search = '',
  specialization = '',
  status = ''
): Promise<PaginatedDoctors> {
  const params = {
    page,
    size,
    search: search ?? "",
    ...(specialization && { specialization }),
    ...(status && { status }),
  };

  const data = await getDoctors(params);

  return {
    doctors: data.content as MappedDoctorTwo[],
    page: data.number,
    size: data.size,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    first: data.first,
    last: data.last,
  };
}
  }