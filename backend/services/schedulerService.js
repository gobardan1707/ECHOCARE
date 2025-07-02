import { supabase } from '../config/database.js';
import { TwilioService } from './twilioService.js';
import cron from 'node-cron';

export class SchedulerService {
  // Initialize the scheduler
  static initializeScheduler() {
    console.log('🕐 Initializing EchoCare call scheduler...');
    
    // Run every minute to check for scheduled calls
    cron.schedule('* * * * *', async () => {
      await this.checkScheduledCalls();
    });

    console.log('✅ Call scheduler initialized');
  }

  // Check for calls that need to be made
  static async checkScheduledCalls() {
    try {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

      // Get calls scheduled for the next 5 minutes
      const { data: scheduledCalls, error } = await supabase
        .from('call_schedules')
        .select(`
          *,
          patients (*),
          medication_schedules (*)
        `)
        .eq('status', 'scheduled')
        .gte('scheduled_time', now.toISOString())
        .lte('scheduled_time', fiveMinutesFromNow.toISOString());

      if (error) {
        console.error('Error fetching scheduled calls:', error);
        return;
      }

      for (const call of scheduledCalls || []) {
        await this.processScheduledCall(call);
      }

    } catch (error) {
      console.error('Error checking scheduled calls:', error);
    }
  }

  // Process a scheduled call
  static async processScheduledCall(callSchedule) {
    try {
      console.log(`📞 Processing scheduled call for patient: ${callSchedule.patients.name}`);

      // Update call status to in_progress
      await supabase
        .from('call_schedules')
        .update({ status: 'in_progress' })
        .eq('id', callSchedule.id);

      // Prepare medication data
      const medicationData = {
        patientName: callSchedule.patients.name,
        medicationName: callSchedule.medication_schedules.medication_name,
        medicationTime: new Date(callSchedule.scheduled_time).toLocaleTimeString(),
        dosage: callSchedule.medication_schedules.dosage,
        instructions: callSchedule.medication_schedules.instructions,
        patientId: callSchedule.patient_id,
        voiceProfile: callSchedule.patients.voice_profile
      };

      // Initiate the call
      const call = await TwilioService.initiateCall(
        callSchedule.patients.phone_number,
        medicationData,
        callSchedule.patients.language_preference
      );

      // Update call with Twilio SID
      await supabase
        .from('call_schedules')
        .update({ 
          twilio_call_sid: call.sid,
          status: 'in_progress'
        })
        .eq('id', callSchedule.id);

      console.log(`✅ Call initiated for patient: ${callSchedule.patients.name}`);

    } catch (error) {
      console.error('Error processing scheduled call:', error);
      
      // Update call status to failed
      await supabase
        .from('call_schedules')
        .update({ 
          status: 'failed',
          notes: error.message
        })
        .eq('id', callSchedule.id);
    }
  }

  // Schedule a new call
  static async scheduleCall(patientId, medicationScheduleId, scheduledTime, callType = 'medication_reminder') {
    try {
      const { data: callSchedule, error } = await supabase
        .from('call_schedules')
        .insert({
          patient_id: patientId,
          medication_schedule_id: medicationScheduleId,
          scheduled_time: scheduledTime,
          call_type: callType,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) {
        console.error('Error scheduling call:', error);
        throw error;
      }

      console.log(`✅ Call scheduled for: ${scheduledTime}`);
      return callSchedule;

    } catch (error) {
      console.error('Error scheduling call:', error);
      throw error;
    }
  }
} 