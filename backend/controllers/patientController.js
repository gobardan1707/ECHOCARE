import { supabase } from "../config/database.js";

export class PatientController {
  // Create patient and medication schedule
  static async createPatientAndMedication(req, res) {
    try {
      const {
        phoneNumber,
        name,
        language = "en",
        medicationName,
        dosage,
        frequency,
        timeSlots, // Array of times like ['09:00', '18:00']
        instructions,
        startDate,
        endDate,
        voiceProfile,
      } = req.body;

      // Validate required fields
      if (!phoneNumber || !name || !medicationName || !dosage || !timeSlots) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: phoneNumber, name, medicationName, dosage, timeSlots",
        });
      }

      // Insert patient
      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .insert({
          phone_number: phoneNumber,
          name: name,
          language_preference: language,
          timezone: "IST",
          voice_profile: voiceProfile 
        })
        .select()
        .single();

      if (patientError) {
        console.error("Patient creation error:", patientError);
        return res.status(500).json({
          success: false,
          error: "Failed to create patient",
        });
      }

      // Insert medication schedule
      const { data: medication, error: medicationError } = await supabase
        .from("medication_schedules")
        .insert({
          patient_id: patient.id,
          medication_name: medicationName,
          dosage: dosage,
          frequency: frequency || "daily",
          time_slots: timeSlots,
          instructions: instructions,
          start_date: startDate || new Date().toISOString().split("T")[0],
          end_date: endDate,
        })
        .select()
        .single();

      if (medicationError) {
        console.error("Medication schedule creation error:", medicationError);
        return res.status(500).json({
          success: false,
          error: "Failed to create medication schedule",
        });
      }
      const scheduledCalls = [];

       const baseDateString = startDate || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    for (const timeSlot of timeSlots) {
      // 1. Combine the date from the request with the time from the time slot.
      const [hours, minutes] = timeSlot.split(":");
      const scheduledQueryString = `${baseDateString} ${hours}:${minutes}:00+05:30`;
      const { data: callSchedule, error: callError } = await supabase
        .from("call_schedules")
        .insert({
          patient_id: patient.id,
          medication_schedule_id: medication.id,
          scheduled_time: scheduledQueryString, 
          call_type: "medication_reminder",
          status: "scheduled",
        })
        .select()
        .single();

      if (!callError) {
        scheduledCalls.push(callSchedule);
      } else {
        // It's good practice to log errors inside the loop
        console.error(`Error scheduling call for ${timeSlot}:`, callError);
      }
    }

      res.status(201).json({
        success: true,
        message: "Patient and medication schedule created successfully",
        data: {
          patient,
          medication,
          scheduledCalls,
        },
      });
    } catch (error) {
      console.error("Create patient and medication error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // Get all patients
  static async getPatients(req, res) {
    try {
      const { data: patients, error } = await supabase
        .from("patients")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.error("Get patients error:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to fetch patients",
        });
      }

      res.status(200).json({
        success: true,
        data: patients,
      });
    } catch (error) {
      console.error("Get patients error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // Get patient with medication schedules
  static async getPatient(req, res) {
    try {
      const { id } = req.params;

      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .select(
          `
          *,
          medication_schedules (*),
          call_schedules (*)
        `
        )
        .eq("id", id)
        .single();

      if (patientError || !patient) {
        return res.status(404).json({
          success: false,
          error: "Patient not found",
        });
      }

      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      console.error("Get patient error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // Update patient
  static async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { data: patient, error } = await supabase
        .from("patients")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error || !patient) {
        return res.status(404).json({
          success: false,
          error: "Patient not found",
        });
      }

      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      console.error("Update patient error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // Delete patient (soft delete)
  static async deletePatient(req, res) {
    try {
      const { id } = req.params;

      const { data: patient, error } = await supabase
        .from("patients")
        .update({ is_active: false })
        .eq("id", id)
        .select()
        .single();

      if (error || !patient) {
        return res.status(404).json({
          success: false,
          error: "Patient not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Patient deactivated successfully",
      });
    } catch (error) {
      console.error("Delete patient error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
