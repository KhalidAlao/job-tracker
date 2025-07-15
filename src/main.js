import './style.css'


let jobs = [];
const savedJobs = localStorage.getItem("jobs");

try {
  jobs = savedJobs ? JSON.parse(savedJobs) : [];
} catch (e) {
  console.error("Error parsing saved jobs:", e);
  jobs = [];
}


const jobList = document.getElementById("job-list");
const template = document.getElementById("job-card-template");
const addBtn = document.getElementById("add-btn");
const applicationForm = document.getElementById("application-form");
const jobTitleInput = document.getElementById("job-title-input");
const companyNameInput = document.getElementById("company-name-input");
const jobStatusSelect = document.getElementById("job-status-select");
const companyLocationInput = document.getElementById("company-location-input");
let jobBeingEdited = null;




function renderJobs() {
  jobList.innerHTML = ''; // Clear the list

  if (jobs.length === 0) {
    jobList.innerHTML = "<p>No job applications yet.</p>";
    return;
  }

  jobs.forEach((job) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.job-id').textContent = `Unique ID: ${job.id}`;
    clone.querySelector('.job-title').textContent = job.title;
    clone.querySelector('.company-name').textContent = `Job Title: ${job.company}`;
    clone.querySelector('.company-location').textContent = `Job Location: ${job.location}`;
    clone.querySelector('.job-status').textContent = `Status: ${job.status}`;
    clone.querySelector('.date-added').textContent = `Date Added: ${job.dateAdded}`;
    clone.querySelector('.job-card').dataset.id = job.id;

    jobList.appendChild(clone);


  });
}

renderJobs();

function addJob(title, company, location, status) {
  const job = {
    id: `${Date.now()}-${Math.random().toString(36).slice(0, 1)}`,
    title,
    company,
    location,
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

function editJob(id) {
  const job = jobs.find((job) => job.id === id);
  if (!job) return;

  jobBeingEdited = job;

  jobTitleInput.value = job.title;
  companyNameInput.value = job.company;
  jobStatusSelect.value = job.status;
  companyLocationInput.value = job.location;

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

  if (!title || !company || status === "all") {
    alert("Please fill in all fields correctly!");
    return;
  }

  if (jobBeingEdited) {
    
    jobBeingEdited.title = title;
    jobBeingEdited.company = company;
    jobBeingEdited.location = location;
    jobBeingEdited.status = status;
    jobBeingEdited.dateAdded = new Date().toLocaleDateString(); 

    localStorage.setItem("jobs", JSON.stringify(jobs));
    jobBeingEdited = null; // Reset the state
  } else {
    
    addJob(title, company,location , status);
  }

  
  jobTitleInput.value = "";
  companyNameInput.value = "";
  companyLocationInput.value = "";
  jobStatusSelect.value = "all";
  applicationForm.classList.add("hide");
  renderJobs();


});

jobList.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-btn')) {
    const jobCard = event.target.closest('.job-card');
    if (jobCard) {
      const id = jobCard.dataset.id;
      deleteJob(id);
    }
  }
  

  if (event.target.classList.contains('edit-btn')) {
    const jobCard = event.target.closest('.job-card');
    if (jobCard) {
      const id = jobCard.dataset.id;
      editJob(id);
    }
  }
});