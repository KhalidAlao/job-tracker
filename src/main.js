import './style.css'



let jobs = [];

const savedJobs = localStorage.getItem("jobs");
  if (savedJobs) {
    jobs = JSON.parse(savedJobs);
  }

const jobList = document.getElementById("job-list");
const template = document.getElementById("job-card-template");
const addBtn = document.getElementById("add-btn");
const applicationForm = document.getElementById("application-form");
const jobTitle = document.getElementById("job-title");
const companyName = document.getElementById("company-name");
const jobStatus = document.getElementById("job-status");



function renderJobs() {
  jobList.innerHTML = ''; // Clear the list

  jobs.forEach((job) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('.job-id').textContent = `Unique ID: ${job.id}`;
    clone.querySelector('.job-title').textContent = job.title;
    clone.querySelector('.company-name').textContent = job.company;
    clone.querySelector('.job-status').textContent = `Status: ${job.status}`;
    clone.querySelector('.date-added').textContent = `Date Added: ${job.dateAdded}`;

    // Add custom data for later use (e.g., editing/deleting)
    clone.querySelector('.job-card').dataset.id = job.id;

    jobList.appendChild(clone);
  });
}

renderJobs();

function addJob(title, company, status) {
  const job = {
    id: Date.now().toString(),
    title,
    company,
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

applicationForm.addEventListener("submit", function() {
event.preventDefault();

const title = jobTitle.value;
const company = companyName.value;
const status = jobStatus.value;



if (title.trim() === "" || company.trim() === "" || status === "all") {
  alert("Please fill in any empty fields!");

}

else {
  addJob(title, company, status);
  jobTitle.value = "";
  companyName.value = "";
  jobStatus.value = "All";
  applicationForm.classList.add("hide");
}


});