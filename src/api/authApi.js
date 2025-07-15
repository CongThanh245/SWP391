
import {getEndpointByOperationId} from "../utils/loadApiEndpoint"
import apiClient from "./axiosConfig"
import {formatDate} from '@utils/format'

const API_BASE_URL = "http://localhost:8088/api/v1";

// Utility function to parse full name
const parseFullName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') {
        return { firstName: "", lastName: "" };
    }

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    return { firstName, lastName };
};

export const registerUser = async (data) => {
    try {
        const { firstName, lastName } = parseFullName(data.fullName);

        const { method, path } = await getEndpointByOperationId("register");
       const payload = {
            patientName: `${firstName} ${lastName}`,
            email: data.email,
            password: data.password,
            dateOfBirth: data.dateOfBirth,
            phoneNumber: data.phoneNumber,
            gender: 'MALE'
        };

        let response;
        if (method === "POST") {
            response = await apiClient.post(`${API_BASE_URL}${path}`, payload);
        } else if (method === "GET") {
            response = await apiClient.get(`${API_BASE_URL}${path}`, { params: payload });
        } else {
            throw new Error(`Phương thức ${method} chưa được hỗ trợ`);
        }

        // Check if response is successful
        if (response.status === 200 || response.status === 202) {
            return response.data;
        }

        throw new Error('Unexpected response status');
    } catch (error) {
        // Enhanced error handling
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const message = error.response.data?.message;

            switch (status) {
                case 409:
                    throw new Error(message || 'Email đã được sử dụng');
                case 400:
                    throw new Error(message || 'Dữ liệu không hợp lệ');
                case 422:
                    throw new Error(message || 'Thông tin đăng ký không đúng định dạng');
                case 500:
                    throw new Error('Lỗi máy chủ. Vui lòng thử lại sau');
                default:
                    throw new Error(message || 'Đăng ký thất bại. Vui lòng thử lại sau');
            }
        } else if (error.request) {
            // Network error
            throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng');
        } else {
            // Other errors
            throw new Error(error.message || 'Đã xảy ra lỗi không xác định');
        }
    }
};


/**
 * Gửi yêu cầu xác thực OTP từ email và mã OTP
 * @param {Object} data - Dữ liệu gồm email và otp
 * @param {string} data.email - Email người dùng
 * @param {string} data.otp - Mã OTP
 * @returns {Promise<Object>} - Kết quả từ server nếu thành công
 * @throws Lỗi với message phù hợp nếu thất bại
 */
export const verifyOtp = async (token) => {
    try {
        const { method, path } = await getEndpointByOperationId("confirm");
       let response;
        if (method === "GET") {
            response = await apiClient.get(`${API_BASE_URL}${path}`, { params: { token } });
        } else if (method === "POST") {
            response = await apiClient.post(`${API_BASE_URL}${path}`, { token });
        } else {
            throw new Error(`Phương thức ${method} chưa được hỗ trợ`);
        }
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Unexpected response status');
    } catch (error) {
        if (error.response) {
            const message = error.response.data?.message || 'Lỗi kích hoạt tài khoản';
            throw new Error(message);
        }
        throw new Error(error.message || 'Lỗi mạng hoặc không xác định');
    }
}

export const authenticateUser = async (data) =>{
    try {
        const {method, path} = await getEndpointByOperationId("authenticate");

        const payload = {
            email: data.email,
            password: data.password,
        };
        let response;
        if(method === "POST"){
            response = await apiClient.post(`${API_BASE_URL}${path}`, payload);
        }else {
            throw new Error(`Phương thức ${method} chưa được hỗ trợ`);
        }
         if (response.status === 200) {
            return response.data;
        }
        throw new Error('Unexpected response status');
    } catch (error) {
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const message = error.response.data?.message;

            switch (status) {
                case 401:
                    throw new Error(message || 'Email/tên đăng nhập hoặc mật khẩu không đúng');
                case 403:
                    throw new Error(message || 'Tài khoản chưa được kích hoạt hoặc bị khóa');
                case 400:
                    throw new Error(message || 'Thông tin đăng nhập không hợp lệ');
                case 429:
                    throw new Error(message || 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau');
                case 500:
                    throw new Error('Lỗi máy chủ. Vui lòng thử lại sau');
                default:
                    throw new Error(message || 'Đăng nhập thất bại. Vui lòng thử lại sau');
            }
        } else if (error.request) {
            // Network error
            throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng');
        } else {
            // Other errors
            throw new Error(error.message || 'Đã xảy ra lỗi không xác định');
        }
    }
}