import { useState, useEffect } from "react";
import apiClient from "@api/axiosConfig";

const useTimeSlots = (doctorId, date) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctorId || !date) {
        setTimeSlots([]);
        return;
      }

      setLoadingSlots(true);
      setError("");
      setTimeSlots([]);

      try {
        console.log(`Fetching slots for doctorId: ${doctorId}, date: ${date}`);
        let response = await apiClient.get("/slot", {
          params: { doctorId, date },
        });

        if (!response.data || response.data.length === 0) {
          console.log("No slots found, generating...");
          await apiClient.post("/slot/generate", null, {
            params: { doctorId, date },
          });
          response = await apiClient.get("/slot", {
            params: { doctorId, date },
          });
        }

        if (Array.isArray(response.data)) {
          const uniqueSlots = response.data.reduce((acc, slot) => {
            const existingSlot = acc.find((s) => s.time === slot.startTime);
            if (!existingSlot) {
              acc.push({
                id: slot.id,
                time: slot.startTime,
                available: !slot.booked,
              });
            } else if (!existingSlot.available && !slot.booked) {
              const index = acc.findIndex((s) => s.time === slot.startTime);
              acc[index] = {
                id: slot.id,
                time: slot.startTime,
                available: true,
              };
            }
            return acc;
          }, []);

          uniqueSlots.sort((a, b) => a.time.localeCompare(b.time));
          setTimeSlots(uniqueSlots);
          console.log(`Loaded ${uniqueSlots.length} unique slots`);

          if (uniqueSlots.length === 0) {
            setError("Không có khung giờ khả dụng.");
          }
        } else {
          setError("Dữ liệu khung giờ không hợp lệ.");
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        if (err.response?.status === 409) {
          try {
            const response = await apiClient.get("/slot", {
              params: { doctorId, date },
            });
            if (response.data && response.data.length > 0) {
              const uniqueSlots = response.data
                .filter(
                  (slot, index, arr) =>
                    arr.findIndex((s) => s.startTime === slot.startTime) === index
                )
                .map((slot) => ({
                  id: slot.id,
                  time: slot.startTime,
                  available: !slot.booked,
                }))
                .sort((a, b) => a.time.localeCompare(b.time));

              setTimeSlots(uniqueSlots);
            } else {
              setError("Không có khung giờ khả dụng.");
            }
          } catch (retryErr) {
            setError("Không thể tải khung giờ. Vui lòng thử lại.");
          }
        } else {
          setError("Không thể tải khung giờ. Vui lòng thử lại.");
        }
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [doctorId, date]);

  return { timeSlots, loadingSlots, error };
};

export default useTimeSlots;