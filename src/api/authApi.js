import axios from "axios";

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

        const endpoint = "/auth/register";
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
            firstName,
            lastName,
            email: data.email,
            password: data.password,
            dateOfBirth: data.dateOfBirth,
            phoneNumber: data.phoneNumber,
            username: data.username,
        });

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
                    throw new Error(message || 'Email hoặc tên đăng nhập đã được sử dụng');
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
        const endpoint = "/auth/activate-account";
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
            params: { token }
        });
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