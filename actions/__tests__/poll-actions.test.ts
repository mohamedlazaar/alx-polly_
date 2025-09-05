import { DatabaseService } from "@/app/lib/database";
import type { Poll } from "@/app/types";

import { createPoll, votePoll, deletePoll } from '../../app/components/PollActions';
import { Poll, PollOption } from '../../app/types';

describe('Poll Actions', () => {
  describe('createPoll', () => {
    it('should create a new poll with given options', () => {
      const pollData = {
        question: 'Favorite color?',
        options: ['Red', 'Blue', 'Green']
      };
      
      const result = createPoll(pollData);
      
      expect(result).toEqual({
        id: expect.any(String),
        question: pollData.question,
        options: pollData.options.map(option => ({
          text: option,
          votes: 0
        })),
        createdAt: expect.any(Date)
      });
    });
  });

  describe('votePoll', () => {
    it('should increment vote count for selected option', () => {
      const poll: Poll = {
        id: '123',
        question: 'Favorite color?',
        options: [
          { text: 'Red', votes: 0 },
          { text: 'Blue', votes: 0 }
        ],
        createdAt: new Date()
      };
      
      const result = votePoll(poll.id, 0); // Vote for first option
      
      expect(result.options[0].votes).toBe(1);
      expect(result.options[1].votes).toBe(0);
    });

    it('should throw error for invalid poll id', () => {
      expect(() => votePoll('invalid-id', 0)).toThrow('Poll not found');
    });
  });

  describe('deletePoll', () => {
    it('should delete poll with given id', () => {
      const pollId = '123';
      expect(() => deletePoll(pollId)).not.toThrow();
    });

    it('should throw error for invalid poll id', () => {
      expect(() => deletePoll('invalid-id')).toThrow('Poll not found');
    });
  });
});