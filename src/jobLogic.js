export function filterJobs(jobs, filterStatuses, searchInput) {
    const searchTerm = searchInput.toLowerCase();
    
    return jobs.filter(job => {
      const matchesStatus =
        filterStatuses.length === 0 ? true : filterStatuses.includes(job.status);
  
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        (job.location && job.location.toLowerCase().includes(searchTerm));
  
      return matchesStatus && matchesSearch;
    });
  }
  
  export function sortJobs(jobsArray, sortMethod) {
    const sortBy = sortMethod;
  
    switch (sortBy) {
      case 'newest first':
        return [...jobsArray].sort((a, b) => b.id - a.id);
      case 'oldest first':
        return [...jobsArray].sort((a, b) => a.id - b.id);
      case 'company a-z':
        return [...jobsArray].sort((a, b) => 
          a.company.toLowerCase().localeCompare(b.company.toLowerCase()));
      case 'company z-a':
        return [...jobsArray].sort((a, b) => 
          b.company.toLowerCase().localeCompare(a.company.toLowerCase()));
      default:
        return jobsArray;
    }
  }
  
  export function initializeJobs() {
    let jobs = [];
    let savedJobs = null;
  
    if (typeof window !== 'undefined' && window.localStorage) {
      savedJobs = localStorage.getItem("jobs");
    }
  
    try {
      jobs = savedJobs ? JSON.parse(savedJobs) : [];
    } catch (e) {
      console.error("Error parsing saved jobs:", e);
      jobs = [];
    }
  
    return jobs;
  }
  
  export function saveJobs(jobs) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem("jobs", JSON.stringify(jobs));
    }
  }
  
  export function addJob(jobs, title, company, location, salary, status) {
    const newJob = {
      id: Date.now(),
      title,
      company,
      location,
      salary,
      status,
      dateAdded: new Date().toLocaleDateString(),
    };
  
    const updatedJobs = [...jobs, newJob];
    saveJobs(updatedJobs);
    return updatedJobs;
  }
  
  export function editJob(jobs, id, updates) {
    const updatedJobs = jobs.map(job => {
      if (job.id === id) {
        return { ...job, ...updates };
      }
      return job;
    });
    
    saveJobs(updatedJobs);
    return updatedJobs;
  }
  
  export function deleteJob(jobs, id) {
    const updatedJobs = jobs.filter(job => job.id !== id);
    saveJobs(updatedJobs);
    return updatedJobs;
  }