document.addEventListener("DOMContentLoaded", function () {
  const checkInForm = document.getElementById("checkInForm");
  const attendeeNameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const greeting = document.getElementById("greeting");
  const attendeeCount = document.getElementById("attendeeCount");
  const waterCount = document.getElementById("waterCount");
  const zeroCount = document.getElementById("zeroCount");
  const powerCount = document.getElementById("powerCount");
  const progressBar = document.getElementById("progressBar");
  const attendeeList = document.getElementById("attendeeList");

  const storageKey = "intelCheckInData";
  const maxAttendees = 50;
  let totalAttendees = 0;
  const teamCounts = {
    water: 0,
    zero: 0,
    power: 0,
  };
  let attendees = [];

  function getTeamLabel(teamValue) {
    if (teamValue === "water") {
      return "Team Water Wise";
    }
    if (teamValue === "zero") {
      return "Team Net Zero";
    }
    if (teamValue === "power") {
      return "Team Renewables";
    }
    return "Team";
  }

  function updateCounts() {
    attendeeCount.textContent = String(totalAttendees);
    waterCount.textContent = String(teamCounts.water);
    zeroCount.textContent = String(teamCounts.zero);
    powerCount.textContent = String(teamCounts.power);

    let percent = (totalAttendees / maxAttendees) * 100;
    if (percent > 100) {
      percent = 100;
    }
    progressBar.style.width = percent + "%";
  }

  function renderAttendeeList() {
    attendeeList.innerHTML = "";

    if (attendees.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.classList.add("attendee-empty");
      emptyItem.textContent = "No attendees yet.";
      attendeeList.appendChild(emptyItem);
      return;
    }

    for (let i = 0; i < attendees.length; i = i + 1) {
      const attendee = attendees[i];
      const item = document.createElement("li");
      const nameSpan = document.createElement("span");
      const teamSpan = document.createElement("span");

      item.classList.add("attendee-list-item");
      nameSpan.classList.add("attendee-name");
      teamSpan.classList.add("attendee-team");

      nameSpan.textContent = attendee.name;
      teamSpan.textContent = getTeamLabel(attendee.team);

      item.appendChild(nameSpan);
      item.appendChild(teamSpan);
      attendeeList.appendChild(item);
    }
  }

  function saveData() {
    const data = {
      totalAttendees: totalAttendees,
      teamCounts: teamCounts,
      attendees: attendees,
    };

    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function loadData() {
    const storedData = localStorage.getItem(storageKey);
    if (!storedData) {
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);

      if (typeof parsedData.totalAttendees === "number") {
        totalAttendees = parsedData.totalAttendees;
      }

      if (parsedData.teamCounts) {
        teamCounts.water = Number(parsedData.teamCounts.water) || 0;
        teamCounts.zero = Number(parsedData.teamCounts.zero) || 0;
        teamCounts.power = Number(parsedData.teamCounts.power) || 0;
      }

      if (Array.isArray(parsedData.attendees)) {
        attendees = parsedData.attendees;
      }
    } catch (error) {
      totalAttendees = 0;
      attendees = [];
      teamCounts.water = 0;
      teamCounts.zero = 0;
      teamCounts.power = 0;
    }
  }

  function showGreeting(name, teamValue) {
    const teamLabel = getTeamLabel(teamValue);
    greeting.textContent = `Welcome, ${name}! You are checked in with ${teamLabel}.`;
    greeting.classList.add("success-message");
    greeting.style.display = "block";
  }

  checkInForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = attendeeNameInput.value.trim();
    const teamValue = teamSelect.value;

    if (name === "" || teamValue === "") {
      return;
    }

    totalAttendees = totalAttendees + 1;
    teamCounts[teamValue] = teamCounts[teamValue] + 1;
    attendees.push({ name: name, team: teamValue });

    showGreeting(name, teamValue);
    updateCounts();
    renderAttendeeList();
    saveData();

    attendeeNameInput.value = "";
    teamSelect.selectedIndex = 0;
    attendeeNameInput.focus();
  });

  loadData();
  updateCounts();
  renderAttendeeList();
});
