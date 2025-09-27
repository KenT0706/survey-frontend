<!-- src/views/ResultsDashboard.vue -->
<template>
  <div class="dashboard-container">
    <h2>📊 Admin Dashboard</h2>
    <p v-if="!token" class="error">
      You must <router-link to="/admin-login">login as admin</router-link> to view results.
    </p>

    <div v-else>
      <!-- Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="{ active: activeTab === tab.key }"
          @click="setTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Error display -->
      <p v-if="fetchError" class="error mt-2">{{ fetchError }}</p>

      <!-- Data Section -->
      <div class="data-section">
        <h3>{{ currentTabLabel }} Responses</h3>
        <button @click="fetchResponses" class="refresh-btn">🔄 Refresh</button>

        <!-- List of responses -->
        <ul v-if="responses.length">
          <li
            v-for="(response, i) in responses"
            :key="i"
            class="response-item flex items-center justify-between"
          >
            <span @click="selectResponse(response)" class="cursor-pointer">
              <strong>{{ displayName(response) }}</strong>
              <span v-if="joinedDate(response)"> — {{ joinedDate(response) }}</span>
            </span>
            <!-- 🗑️ Trash Icon -->
            <button
              class="ml-4 text-red-600 hover:text-red-800"
              @click.stop="deleteResponse(response._id)"
              title="Delete response"
            >
              🗑️
            </button>
          </li>
        </ul>
        <p v-else>No responses found.</p>

        <!-- Response details -->
        <div v-if="selectedResponse" class="response-details">
          <h4>📄 Response Details — {{ displayName(selectedResponse) }}</h4>

          <p v-if="selectedResponse.position"><strong>Position:</strong> {{ selectedResponse.position }}</p>
          <p v-if="selectedResponse.department"><strong>Department:</strong> {{ selectedResponse.department }}</p>
          <p v-if="selectedResponse.dateJoined"><strong>Date Joined:</strong> {{ selectedResponse.dateJoined }}</p>
          <p v-if="joinedDate(selectedResponse)"><strong>Assessment Date:</strong> {{ joinedDate(selectedResponse) }}</p>

          <!-- HR1–HR6 -->
          <div v-for="n in 6" :key="'hr'+n">
            <h5>HR{{ n }}</h5>
            <ul v-if="selectedResponse['hr'+n] && selectedResponse['hr'+n].length">
              <li v-for="(it, idx) in selectedResponse['hr'+n]" :key="'hr'+n+'-'+idx">
                Q{{ idx+1 }} — Importance: {{ it.importance || "NA" }}, Implementation: {{ it.implementation || "NA" }}
              </li>
            </ul>
            <p v-else>No response</p>
          </div>

          <!-- Open Feedback -->
          <h5 class="mt-4">Open Feedback</h5>
          <p v-if="selectedResponse.obstacles"><strong>Obstacles:</strong> {{ selectedResponse.obstacles }}</p>
          <p v-if="selectedResponse.strengthsWeaknesses"><strong>Suggestions:</strong> {{ selectedResponse.strengthsWeaknesses }}</p>
          <p v-if="!selectedResponse.obstacles && !selectedResponse.strengthsWeaknesses">N/A</p>

          <!-- Delete Button -->
          <button
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            @click="deleteResponse(selectedResponse._id)"
          >
            🗑️ Delete Response
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "ResultsDashboard",
  data() {
    return {
      token: localStorage.getItem("token"),
      tabs: [
        { key: "management", label: "Management Assessment", url: "/api/management" },
        { key: "hr", label: "HR Self-Assessment", url: "/api/hr-self-assessment" },
        { key: "survey", label: "User Survey", url: "/api/user-survey" }
      ],
      activeTab: "management",
      responses: [],
      selectedResponse: null,
      fetchError: null
    };
  },
  computed: {
    currentTabLabel() {
      return this.tabs.find(tab => tab.key === this.activeTab)?.label || "";
    }
  },
  methods: {
    setTab(key) {
      this.activeTab = key;
      this.selectedResponse = null;
      this.fetchResponses();
    },
    async fetchResponses() {
      this.fetchError = null;
      try {
        const tab = this.tabs.find(t => t.key === this.activeTab);
        const res = await axios.get(tab.url, { headers: { Authorization: `Bearer ${this.token}` } });
        this.responses = res.data;
      } catch (err) {
        console.error("Error fetching responses:", err);
        if (err.response) {
          this.fetchError = `Error ${err.response.status}: ${err.response.data.message || err.response.data.error || "Unknown error"}`;
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            this.$router.push("/admin-login");
          }
        } else {
          this.fetchError = `Network or server error: ${err.message}`;
        }
      }
    },
    selectResponse(resp) {
      this.selectedResponse = resp;
    },
    async deleteResponse(id) {
      if (!confirm("Are you sure you want to delete this response?")) return;
      try {
        const tab = this.tabs.find(t => t.key === this.activeTab);
        // DELETE URLs
        const url = tab.key === "management" ? `${tab.url}/${id}` : `${tab.url}?id=${id}`;
        await axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } });
        this.responses = this.responses.filter(r => r._id !== id);
        if (this.selectedResponse?._id === id) this.selectedResponse = null;
        alert("Response deleted successfully.");
      } catch (err) {
        console.error("Error deleting response:", err);
        alert(`Failed to delete response: ${err.response?.data?.message || err.message}`);
      }
    },
    displayName(r) {
      if (!r) return "Anonymous";
      return r.managerName || r.name || r.assessorName || r.username || "Anonymous";
    },
    joinedDate(r) {
      if (!r) return null;
      if (r.assessmentDate) return new Date(r.assessmentDate).toLocaleDateString();
      return null;
    }
  },
  mounted() {
    if (this.token) this.fetchResponses();
  }
};
</script>
