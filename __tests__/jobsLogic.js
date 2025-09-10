const {
    filterJobs,
    sortJobs,
    initializeJobs,
    addJob,
    editJob,
    deleteJob,
    saveJobs
  } = require("../src/jobLogic.js");
  
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };
  })();
  
  global.localStorage = localStorageMock;
  
  describe('Job Logic Functions', () => {
    const mockJobs = [
      { 
        id: 1, 
        title: 'Frontend Developer', 
        company: 'Google', 
        location: 'Mountain View, CA', 
        salary: '$120,000', 
        status: 'open', 
        dateAdded: '1/15/2023' 
      },
      { 
        id: 2, 
        title: 'UX Designer', 
        company: 'Apple', 
        location: 'Cupertino, CA', 
        salary: '$110,000', 
        status: 'applied', 
        dateAdded: '1/10/2023' 
      },
      { 
        id: 3, 
        title: 'Backend Engineer', 
        company: 'Microsoft', 
        location: 'Redmond, WA', 
        salary: '$130,000', 
        status: 'interview', 
        dateAdded: '1/20/2023' 
      },
      { 
        id: 4, 
        title: 'Product Manager', 
        company: 'Amazon', 
        location: 'Seattle, WA', 
        salary: '$140,000', 
        status: 'offer', 
        dateAdded: '1/5/2023' 
      },
      { 
        id: 5, 
        title: 'Data Scientist', 
        company: 'Facebook', 
        location: 'Menlo Park, CA', 
        salary: '$125,000', 
        status: 'rejected', 
        dateAdded: '1/25/2023' 
      }
    ];
  
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });
  
    describe('filterJobs', () => {
      test('filters by single status', () => {
        const filtered = filterJobs(mockJobs, ['open'], '');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].status).toBe('open');
        expect(filtered[0].company).toBe('Google');
      });
  
      test('filters by multiple statuses', () => {
        const filtered = filterJobs(mockJobs, ['open', 'applied'], '');
        expect(filtered).toHaveLength(2);
        expect(filtered.map(job => job.status)).toEqual(['open', 'applied']);
      });
  
      test('returns all jobs when no status filter is provided', () => {
        const filtered = filterJobs(mockJobs, [], '');
        expect(filtered).toHaveLength(mockJobs.length);
      });
  
      test('filters by search term in title', () => {
        const filtered = filterJobs(mockJobs, [], 'Developer');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].title).toBe('Frontend Developer');
      });
  
      test('filters by search term in company', () => {
        const filtered = filterJobs(mockJobs, [], 'Google');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].company).toBe('Google');
      });
  
      test('filters by search term in location', () => {
        const filtered = filterJobs(mockJobs, [], 'California');
        expect(filtered).toHaveLength(0); // Should not find "California"
        
        const filteredCA = filterJobs(mockJobs, [], 'CA');
        expect(filteredCA).toHaveLength(3); // Should find "CA" in locations
      });
  
      test('filters by both status and search term', () => {
        const filtered = filterJobs(mockJobs, ['open', 'applied'], 'CA');
        expect(filtered).toHaveLength(2);
        expect(filtered.map(job => job.company)).toEqual(['Google', 'Apple']);
      });
  
      test('is case insensitive', () => {
        const filtered = filterJobs(mockJobs, [], 'google');
        expect(filtered).toHaveLength(1);
        expect(filtered[0].company).toBe('Google');
      });
    });
  
    describe('sortJobs', () => {
      test('sorts by newest first', () => {
        const sorted = sortJobs(mockJobs, 'newest first');
        expect(sorted[0].id).toBe(5); // Most recent (highest ID)
        expect(sorted[4].id).toBe(4); // Oldest (lowest ID)
      });
  
      test('sorts by oldest first', () => {
        const sorted = sortJobs(mockJobs, 'oldest first');
        expect(sorted[0].id).toBe(4); // Oldest (lowest ID)
        expect(sorted[4].id).toBe(5); // Most recent (highest ID)
      });
  
      test('sorts by company a-z', () => {
        const sorted = sortJobs(mockJobs, 'company a-z');
        expect(sorted[0].company).toBe('Amazon');
        expect(sorted[1].company).toBe('Apple');
        expect(sorted[2].company).toBe('Facebook');
        expect(sorted[3].company).toBe('Google');
        expect(sorted[4].company).toBe('Microsoft');
      });
  
      test('sorts by company z-a', () => {
        const sorted = sortJobs(mockJobs, 'company z-a');
        expect(sorted[0].company).toBe('Microsoft');
        expect(sorted[1].company).toBe('Google');
        expect(sorted[2].company).toBe('Facebook');
        expect(sorted[3].company).toBe('Apple');
        expect(sorted[4].company).toBe('Amazon');
      });
  
      test('returns original array when no sort method is provided', () => {
        const sorted = sortJobs(mockJobs, '');
        expect(sorted).toEqual(mockJobs);
      });
  
      test('returns original array for unknown sort method', () => {
        const sorted = sortJobs(mockJobs, 'unknown');
        expect(sorted).toEqual(mockJobs);
      });
    });
  
    describe('initializeJobs', () => {
      test('returns empty array when no jobs in localStorage', () => {
        localStorage.getItem.mockReturnValue(null);
        const jobs = initializeJobs();
        expect(jobs).toEqual([]);
      });
  
      test('returns parsed jobs from localStorage', () => {
        const savedJobs = JSON.stringify(mockJobs);
        localStorage.getItem.mockReturnValue(savedJobs);
        const jobs = initializeJobs();
        expect(jobs).toEqual(mockJobs);
      });
  
      test('returns empty array on parsing error', () => {
        localStorage.getItem.mockReturnValue('invalid json');
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const jobs = initializeJobs();
        expect(jobs).toEqual([]);
        expect(consoleSpy).toHaveBeenCalledWith('Error parsing saved jobs:', expect.any(Error));
        consoleSpy.mockRestore();
      });
    });
  
    describe('saveJobs', () => {
      test('saves jobs to localStorage', () => {
        saveJobs(mockJobs);
        expect(localStorage.setItem).toHaveBeenCalledWith('jobs', JSON.stringify(mockJobs));
      });
    });
  
    describe('addJob', () => {
      test('adds a new job to the array', () => {
        const newJob = {
          title: 'DevOps Engineer',
          company: 'Netflix',
          location: 'Los Gatos, CA',
          salary: '$150,000',
          status: 'open'
        };
  
        const currentTime = Date.now();
        jest.spyOn(Date, 'now').mockReturnValue(currentTime);
  
        const updatedJobs = addJob(mockJobs, newJob.title, newJob.company, newJob.location, newJob.salary, newJob.status);
  
        expect(updatedJobs).toHaveLength(mockJobs.length + 1);
        
        const addedJob = updatedJobs[updatedJobs.length - 1];
        expect(addedJob.id).toBe(currentTime);
        expect(addedJob.title).toBe(newJob.title);
        expect(addedJob.company).toBe(newJob.company);
        expect(addedJob.location).toBe(newJob.location);
        expect(addedJob.salary).toBe(newJob.salary);
        expect(addedJob.status).toBe(newJob.status);
        expect(addedJob.dateAdded).toBe(new Date().toLocaleDateString());
  
        expect(localStorage.setItem).toHaveBeenCalledWith('jobs', JSON.stringify(updatedJobs));
  
        Date.now.mockRestore();
      });
    });
  
    describe('editJob', () => {
      test('updates an existing job', () => {
        const jobId = 2;
        const updates = {
          title: 'Senior UX Designer',
          status: 'interview',
          salary: '$125,000'
        };
  
        const updatedJobs = editJob(mockJobs, jobId, updates);
        
        const editedJob = updatedJobs.find(job => job.id === jobId);
        expect(editedJob.title).toBe(updates.title);
        expect(editedJob.status).toBe(updates.status);
        expect(editedJob.salary).toBe(updates.salary);
        
        // Other properties should remain unchanged
        expect(editedJob.company).toBe('Apple');
        expect(editedJob.location).toBe('Cupertino, CA');
  
        expect(localStorage.setItem).toHaveBeenCalledWith('jobs', JSON.stringify(updatedJobs));
      });
  
      test('returns original array if job not found', () => {
        const updatedJobs = editJob(mockJobs, 999, { title: 'New Title' });
        expect(updatedJobs).toEqual(mockJobs);
        expect(localStorage.setItem).not.toHaveBeenCalled();
      });
    });
  
    describe('deleteJob', () => {
      test('removes a job from the array', () => {
        const jobId = 3;
        const updatedJobs = deleteJob(mockJobs, jobId);
        
        expect(updatedJobs).toHaveLength(mockJobs.length - 1);
        expect(updatedJobs.find(job => job.id === jobId)).toBeUndefined();
        expect(localStorage.setItem).toHaveBeenCalledWith('jobs', JSON.stringify(updatedJobs));
      });
  
      test('returns original array if job not found', () => {
        const updatedJobs = deleteJob(mockJobs, 999);
        expect(updatedJobs).toEqual(mockJobs);
        expect(localStorage.setItem).not.toHaveBeenCalled();
      });
    });
  });
  
  
 
  