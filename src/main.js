import './style.css'

let jobs = [];
const savedJobs = localStorage.getItem("jobs");

try {
  jobs = savedJobs ? JSON.parse(savedJobs) : [];
} catch (e) {
  console.error("Error parsing saved jobs:", e);
  jobs = [];
}

let currentSort = "newest first"


const jobList = document.getElementById("job-list");
const template = document.getElementById("job-card-template");
const addBtn = document.getElementById("add-btn");
const applicationForm = document.getElementById("application-form");
const jobTitleInput = document.getElementById("job-title-input");
const companyNameInput = document.getElementById("company-name-input");
const jobStatusSelect = document.getElementById("job-status-select");
const companyLocationInput = document.getElementById("company-location-input");
const companySalaryInput = document.getElementById("company-salary-input");

const statusFilter = document.querySelectorAll('#statusFilter input[type="checkbox"]');


let filterStatuses = []; 

const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-btn");


let jobBeingEdited = null;


function renderJobs() {
  jobList.innerHTML = ''; // Clear the list

  
  const searchValue = searchInput.value.toLowerCase();



  const filteredJobs = jobs.filter( job => {
    const matchesStatus = filterStatuses.length === 0 ? true : filterStatuses.includes(job.status);
    const matchesSearch = job.title.toLowerCase().includes(searchValue) || 
                          job.company.toLowerCase().includes(searchValue) || 
                         (job.location && job.location.toLowerCase().includes(searchValue));

    return matchesStatus && matchesSearch;
  });

  if (filteredJobs.length === 0) {
    jobList.innerHTML = "<p>No job applications yet.</p>";
    return;
  }

  const jobsToRender = currentSort ? sortJobs(filteredJobs, currentSort) : filteredJobs;

  jobsToRender.forEach((job) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.job-id').textContent = `Unique ID: ${job.id}`;
    clone.querySelector('.job-title').textContent = `${job.title}`;
    clone.querySelector('.company-name').textContent = `Company: ${job.company}`;
    clone.querySelector('.company-location').textContent = `Location: ${job.location}`;
    clone.querySelector('.company-salary').textContent = `Salary: ${job.salary}`;
    clone.querySelector('.job-status').textContent = `Status: ${job.status}`;
    clone.querySelector('.date-added').textContent = `Date Added: ${job.dateAdded}`;
    clone.querySelector('.job-card').dataset.id = job.id;

    jobList.appendChild(clone);


  });
}

document.getElementById('statusFilter').addEventListener("change", function(event) {
  if (event.target.type === "checkbox") {
    filterStatuses = Array.from(statusFilter)
                          .filter(box => box.checked)
                          .map(box => box.value);
    renderJobs();
  }
});



searchInput.addEventListener("input", renderJobs);

renderJobs();

function addJob(title, company, location, salary, status) {
  const job = {
    id: Date.now(),
    title,
    company,
    location,
    salary,
    status,
    dateAdded: new Date().toLocaleDateString(),
  };

  jobs.push(job);

  localStorage.setItem("jobs", JSON.stringify(jobs));
  
  renderJobs();
}

addBtn.addEventListener("click", function() {
  applicationForm.classList.toggle('hide');
});

clearBtn.addEventListener("click", function() {
  statusFilter.forEach(box => box.checked = false);
  filterStatuses = [];
  renderJobs();
});

function editJob(id) {
  const job = jobs.find((job) => job.id === id);
  if (!job) return;

  jobBeingEdited = job;

  jobTitleInput.value = job.title;
  companyNameInput.value = job.company;
  jobStatusSelect.value = job.status;
  companyLocationInput.value = job.location;
  companySalaryInput.value = job.salary;

  applicationForm.classList.remove("hide");


}


function deleteJob(id) {

jobs = jobs.filter(job => job.id !== id );
localStorage.setItem("jobs", JSON.stringify(jobs));
renderJobs();
};

applicationForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const title = jobTitleInput.value;
  const company = companyNameInput.value;
  const status = jobStatusSelect.value;
  const location = companyLocationInput.value;
  const salary = companySalaryInput.value;

  if (!title || !company || status === "all" || !location || !salary ) {
    alert("Please fill in all fields correctly!");
    return;
  }

  if (jobBeingEdited) {
    
    jobBeingEdited.title = title;
    jobBeingEdited.company = company;
    jobBeingEdited.location = location;
    jobBeingEdited.salary = salary;
    jobBeingEdited.status = status;
    jobBeingEdited.dateAdded = new Date().toLocaleDateString(); 

    localStorage.setItem("jobs", JSON.stringify(jobs));
    jobBeingEdited = null; // Reset the state
  } else {
    
    addJob(title, company,location ,salary , status);
  }

  
  jobTitleInput.value = "";
  companyNameInput.value = "";
  companyLocationInput.value = "";
  companySalaryInput.value = "";
  jobStatusSelect.value = "all";
  applicationForm.classList.add("hide");
  renderJobs();


});


function sortJobs(jobsArray, sortMethod) {
  const sortBy = sortMethod;

  switch (sortBy) {
    case 'newest first':
      return [...jobsArray].sort((a, b) => b.id - a.id);
    case 'oldest first':
      return [...jobsArray].sort((a, b) => a.id - b.id);
    case 'company a-z':
      return [...jobsArray].sort((a, b) => 
        (a.company).toLowerCase().localeCompare((b.company).toLowerCase()));
    case 'company z-a':
      return [...jobsArray].sort((a, b) => 
        (b.company).toLowerCase().localeCompare((a.company).toLowerCase()));
    default:
      return jobsArray;
  }
}



document.getElementById("sort-select").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderJobs();
});

jobList.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-btn')) {
    const jobCard = event.target.closest('.job-card');
    if (jobCard) {
      const id = Number(jobCard.dataset.id);
      deleteJob(id);
    }
  }

  if (event.target.classList.contains('edit-btn')) {
    const jobCard = event.target.closest('.job-card');
    if (jobCard) {
      const id = Number(jobCard.dataset.id);
      editJob(id);
    }
  }
});