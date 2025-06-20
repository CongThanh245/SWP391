import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom styled components for the dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'var(--card-background)',
    border: `1px solid var(--card-border)`,
    borderRadius: 'var(--border-radius-2)',
    boxShadow: 'var(--box-shadow)',
    fontFamily: 'var(--font-family)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--font-size-lg)',
  color: 'var(--text-primary)',
  backgroundColor: 'var(--light-background)',
  padding: 'var(--spacing-md)',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: 'var(--card-background)',
  padding: 'var(--spacing-md)',
  '& .MuiDialogContentText-root': {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-base)',
    color: 'var(--text-secondary)',
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: 'var(--spacing-md)',
  backgroundColor: 'var(--light-background)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontFamily: 'var(--font-family)',
  fontSize: 'var(--font-size-sm)',
  borderRadius: 'var(--border-radius-1)',
  padding: 'var(--spacing-xs) var(--spacing-md)',
  textTransform: 'none',
}));

const CancelButton = styled(StyledButton)(({ theme }) => ({
  color: 'var(--text-secondary)',
  border: `1px solid var(--button-secondary-border)`,
  backgroundColor: 'var(--button-secondary-bg)',
  '&:hover': {
    backgroundColor: 'var(--hover-accent)',
    borderColor: 'var(--card-hover-border)',
  },
}));

const ConfirmButton = styled(StyledButton)(({ theme }) => ({
  color: 'var(--button-primary-text)',
  backgroundColor: 'var(--warning-red)',
  '&:hover': {
    backgroundColor: '#dc2626',
    boxShadow: '#dc2626',
  },
}));

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  content = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
}) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <StyledDialogTitle id="confirmation-dialog-title">{title}</StyledDialogTitle>
      <StyledDialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {content}
        </DialogContentText>
      </StyledDialogContent>
      <StyledDialogActions>
        <CancelButton onClick={onClose}>{cancelText}</CancelButton>
        <ConfirmButton onClick={onConfirm} autoFocus>
          {confirmText}
        </ConfirmButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default ConfirmationDialog;