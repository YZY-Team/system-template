import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const DateTimePicker = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState({ hours: "12", minutes: "00" });

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTime((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onDayClick={handleDayClick}
        className="rounded-md border shadow"
      />
      <div className="mt-4">
        <label htmlFor="hours" className="mr-2">
          Hours:
        </label>
        <select
          id="hours"
          name="hours"
          value={time.hours}
          onChange={handleTimeChange}
          className="border rounded p-1"
        >
          {[...Array(24).keys()].map((hour) => (
            <option key={hour} value={hour.toString().padStart(2, "0")}>
              {hour.toString().padStart(2, "0")}
            </option>
          ))}
        </select>
        <label htmlFor="minutes" className="ml-4 mr-2">
          Minutes:
        </label>
        <Input type="number" className="w-16" />
      </div>
      <div className="mt-4">
        <p>Selected Date: {selectedDate?.toLocaleDateString()}</p>
        <p>
          Selected Time: {time.hours}:{time.minutes}
        </p>
      </div>
    </div>
  );
};
