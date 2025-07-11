
import React from 'react';
import { Card } from '@components/ui/card';
import { formatDate } from '@utils/format';
interface PatientData {
  name: string;
  patientId: string;
  gender: string;
  birthYear: string;
  city: string;
  email: string;
  phone: string;
  spousePatientName: string;
  spousePatientAddress: string;
  spousePatientPhone: string;
  spouseDateOfBirth: string;
  spouseGender: string;
}

interface PatientInfoProps {
  patient: PatientData;
}
const genderMap = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác', PREFER_NOT_TO_SAY: 'Chưa tiết lộ' };

const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  return (
    <>
      <Card className="p-6 mb-6 bg-white shadow-lg border border-[color:var(--card-border)]">
        <h2 className="text-xl font-semibold mb-4 text-[color:var(--text-accent)]">
          Thông tin bệnh nhân
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Họ và tên:</p>
            <p className="font-medium">{patient.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Mã bệnh nhân:</p>
            <p className="font-medium">{patient.patientId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Giới tính:</p>
            <p className="font-medium">{genderMap[patient.gender]}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Ngày tháng năm sinh:</p>
            <p className="font-medium">{formatDate(patient.birthYear)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Thành phố:</p>
            <p className="font-medium">{patient.city}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Email:</p>
            <p className="font-medium">{patient.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Số điện thoại:</p>
            <p className="font-medium">{patient.phone}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6 bg-white shadow-lg border border-[color:var(--card-border)]">
        <h2 className="text-xl font-semibold mb-4 text-[color:var(--text-accent)]">
          Thông tin vợ hoặc chồng bệnh nhân
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Họ và tên:</p>
            <p className="font-medium">{patient.spousePatientName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Mã bệnh nhân:</p>
            <p className="font-medium">{patient.patientId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Giới tính:</p>
            <p className="font-medium">{genderMap[patient.gender]}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Ngày tháng năm sinh:</p>
            <p className="font-medium">{formatDate(patient.spouseDateOfBirth)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Thành phố:</p>
            <p className="font-medium">{patient.spousePatientAddress}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Email:</p>
            <p className="font-medium">{patient.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-[color:var(--text-secondary)]">Số điện thoại:</p>
            <p className="font-medium">{patient.spousePatientPhone}</p>
          </div>
        </div>
      </Card>

    </>
  );
};

export default PatientInfo;
