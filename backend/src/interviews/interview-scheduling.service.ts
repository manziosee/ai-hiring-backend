import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterviewSchedulingService {
  constructor(private prisma: PrismaService) {}

  async scheduleInterview(data: {
    applicationId: string;
    interviewerId: string;
    scheduledAt: Date;
    type: 'PHONE' | 'VIDEO' | 'IN_PERSON';
    duration: number;
  }) {
    const interview = await this.prisma.interview.create({
      data: {
        applicationId: data.applicationId,
        scheduledById: data.interviewerId,
        scheduledAt: data.scheduledAt,
        mode: data.type,
        notes: `${data.type} interview scheduled for ${data.duration} minutes`
      },
      include: {
        application: {
          include: { candidate: true, job: true }
        },
        scheduledBy: true
      }
    });

    return interview;
  }

  async getAvailableSlots(interviewerId: string, date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(17, 0, 0, 0);

    const existingInterviews = await this.prisma.interview.findMany({
      where: {
        scheduledById: interviewerId,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    // Generate available slots (mock implementation)
    const slots: { time: Date; available: boolean; duration: number }[] = [];
    for (let hour = 9; hour < 17; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      
      const isBooked = existingInterviews.some(interview => 
        interview.scheduledAt.getHours() === hour
      );

      if (!isBooked) {
        slots.push({
          time: slotTime,
          available: true,
          duration: 60
        });
      }
    }

    return slots;
  }

  async getInterviewsByUser(userId: string, role: string) {
    const where = role === 'CANDIDATE' 
      ? { application: { userId: userId } }
      : { scheduledById: userId };

    return this.prisma.interview.findMany({
      where,
      include: {
        application: {
          include: { candidate: true, job: true }
        },
        scheduledBy: true
      },
      orderBy: { scheduledAt: 'asc' }
    });
  }
}