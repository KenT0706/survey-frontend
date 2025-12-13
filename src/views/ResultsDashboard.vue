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
        <ul v-if="responses.length" class="response-list">
          <li
            v-for="(response, i) in responses"
            :key="i"
            class="response-item flex items-center justify-between"
          >
            <span @click="selectResponse(response)" class="cursor-pointer">
              <strong>{{ displayName(response) }}</strong>
              <span v-if="getAssessmentDate(response)"> — {{ getAssessmentDate(response) }}</span>
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

          <!-- Basic Information -->
          <div class="basic-info">
            <p v-if="selectedResponse.name"><strong>Name:</strong> {{ selectedResponse.name }}</p>
            <p v-if="selectedResponse.position"><strong>Position:</strong> {{ selectedResponse.position }}</p>
            <p v-if="selectedResponse.department"><strong>Department:</strong> {{ selectedResponse.department }}</p>
            <p v-if="selectedResponse.dateJoined"><strong>Date Joined:</strong> {{ selectedResponse.dateJoined }}</p>
            <p v-if="getAssessmentDate(selectedResponse)"><strong>Assessment Date:</strong> {{ getAssessmentDate(selectedResponse) }}</p>
          </div>

          <!-- HR1–HR6 Ratings -->
          <div v-for="n in 6" :key="'hr'+n" class="rating-section">
            <h5>HR{{ n }}</h5>
            <div v-if="selectedResponse['hr'+n] && selectedResponse['hr'+n].length" class="rating-items">
              <div v-for="(item, idx) in selectedResponse['hr'+n]" :key="'hr'+n+'-'+idx" class="rating-item">
                <strong>Q{{ idx+1 }}:</strong> 
                Importance: <span :class="getRatingClass(item.importance)">{{ item.importance || "NA" }}</span>, 
                Implementation: <span :class="getRatingClass(item.implementation)">{{ item.implementation || "NA" }}</span>
              </div>
            </div>
            <p v-else class="no-response">No response</p>
          </div>

          <!-- Open Feedback -->
          <div class="open-feedback">
            <h5>Open Feedback</h5>
            <p v-if="selectedResponse.obstacles"><strong>Obstacles:</strong> {{ selectedResponse.obstacles }}</p>
            <p v-if="selectedResponse.suggestions"><strong>Suggestions:</strong> {{ selectedResponse.suggestions }}</p>
            <p v-if="selectedResponse.strengthsWeaknesses"><strong>Strengths & Weaknesses:</strong> {{ selectedResponse.strengthsWeaknesses }}</p>
            <p v-if="!selectedResponse.obstacles && !selectedResponse.suggestions && !selectedResponse.strengthsWeaknesses">N/A</p>
          </div>

          <!-- Delete Button -->
          <button
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            @click="deleteResponse(selectedResponse._id)"
          >
            🗑️ Delete Response
          </button>
        </div>

        <!-- Spreadsheet Summary Section -->
        <div v-if="responses.length && activeTab !== 'quadrant'" class="spreadsheet-section mt-8">
          <h3>📋 {{ currentTabLabel }} Summary Spreadsheet</h3>
          <p class="text-sm text-gray-600 mb-4">Showing all {{ responses.length }} responses</p>
          
          <div class="table-container">
            <table class="summary-table">
              <thead>
                <tr>
                  <!-- Dynamic headers based on survey type -->
                  <th>Name</th>
                  <th v-if="showPositionColumn">Position</th>
                  <th v-if="showDepartmentColumn">Department</th>
                  <th v-if="showDateJoinedColumn">Date Joined</th>
                  <th>Assessment Date</th>
                  
                  <!-- Question Headers -->
                  <th v-for="(question, index) in currentQuestions" :key="'q'+index" colspan="2" class="question-header">
                    {{ question.text }}
                  </th>
                  
                  <!-- Open-ended questions -->
                  <th v-if="showObstaclesColumn">Obstacles</th>
                  <th v-if="showSuggestionsColumn">Suggestions</th>
                  <th v-if="showStrengthsColumn">Strengths & Weaknesses</th>
                </tr>
                <tr>
                  <!-- Sub-headers for ratings -->
                  <th v-for="header in basicHeaders" :key="header"></th>
                  <template v-for="(question, qIndex) in currentQuestions" :key="'sub'+qIndex">
                    <th class="sub-header">Importance</th>
                    <th class="sub-header">Implementation</th>
                  </template>
                  <th v-if="showObstaclesColumn"></th>
                  <th v-if="showSuggestionsColumn"></th>
                  <th v-if="showStrengthsColumn"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="response in responses" :key="response._id" class="data-row">
                  <!-- Basic Info -->
                  <td class="font-medium">{{ displayName(response) }}</td>
                  <td v-if="showPositionColumn">{{ response.position || 'N/A' }}</td>
                  <td v-if="showDepartmentColumn">{{ response.department || 'N/A' }}</td>
                  <td v-if="showDateJoinedColumn">{{ response.dateJoined || 'N/A' }}</td>
                  <td>{{ getAssessmentDate(response) || 'N/A' }}</td>
                  
                  <!-- Ratings Data -->
                  <template v-for="section in currentSections" :key="section">
                    <template v-if="response[section] && response[section].length">
                      <template v-for="(item, index) in response[section]" :key="section+index">
                        <td :class="getRatingClass(item.importance)">{{ item.importance || 'NA' }}</td>
                        <td :class="getRatingClass(item.implementation)">{{ item.implementation || 'NA' }}</td>
                      </template>
                    </template>
                    <template v-else>
                      <template v-for="index in getSectionLength(section)" :key="section+index">
                        <td class="rating-na">NA</td>
                        <td class="rating-na">NA</td>
                      </template>
                    </template>
                  </template>
                  
                  <!-- Open-ended responses -->
                  <td v-if="showObstaclesColumn" class="open-ended-cell">
                    {{ response.obstacles || 'N/A' }}
                  </td>
                  <td v-if="showSuggestionsColumn" class="open-ended-cell">
                    {{ response.suggestions || 'N/A' }}
                  </td>
                  <td v-if="showStrengthsColumn" class="open-ended-cell">
                    {{ response.strengthsWeaknesses || 'N/A' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Export Button -->
          <div class="export-section mt-4">
            <button @click="exportToCSV" class="export-btn">
              📥 Export to CSV
            </button>
            <span class="text-sm text-gray-600 ml-4">Total: {{ responses.length }} records</span>
          </div>
        </div>

        <!-- Statistics Section -->
        <div v-if="responses.length && activeTab !== 'quadrant'" class="statistics-section mt-8">
          <h3>📊 Response Statistics</h3>
          <p class="text-sm text-gray-600 mb-4">Breakdown of ratings for each question</p>

          <!-- Statistics Tabs -->
          <div class="stats-tabs">
            <button
              v-for="section in currentSections"
              :key="section"
              :class="{ active: activeStatsSection === section }"
              @click="activeStatsSection = section"
            >
              {{ section.toUpperCase() }}
            </button>
          </div>

          <!-- Statistics Table -->
          <div class="stats-container">
            <div class="stats-table-container">
              <table class="stats-table">
                <thead>
                  <tr>
                    <th rowspan="2" class="question-col">Question</th>
                    <th colspan="6" class="rating-header importance-header">Importance</th>
                    <th colspan="6" class="rating-header implementation-header">Implementation</th>
                  </tr>
                  <tr>
                    <!-- Importance sub-headers -->
                    <th class="count-header">1</th>
                    <th class="count-header">2</th>
                    <th class="count-header">3</th>
                    <th class="count-header">4</th>
                    <th class="count-header">NA</th>
                    <th class="total-header">Total</th>
                    
                    <!-- Implementation sub-headers -->
                    <th class="count-header">1</th>
                    <th class="count-header">2</th>
                    <th class="count-header">3</th>
                    <th class="count-header">4</th>
                    <th class="count-header">NA</th>
                    <th class="total-header">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(question, index) in getCurrentSectionQuestions()" :key="index" class="stats-row">
                    <td class="question-text">
                      <strong>Q{{ index + 1 }}:</strong> {{ question }}
                    </td>
                    
                    <!-- Importance counts -->
                    <td :class="getStatsCellClass('importance', 1, index)" class="count-cell">
                      {{ getRatingCount('importance', 1, index) }}
                      <span class="percentage" v-if="getRatingCount('importance', 1, index) > 0">
                        ({{ getPercentage('importance', 1, index) }}%)
                      </span>
                    </td>
                    <td :class="getStatsCellClass('importance', 2, index)" class="count-cell">
                      {{ getRatingCount('importance', 2, index) }}
                      <span class="percentage" v-if="getRatingCount('importance', 2, index) > 0">
                        ({{ getPercentage('importance', 2, index) }}%)
                      </span>
                    </td>
                    <td :class="getStatsCellClass('importance', 3, index)" class="count-cell">
                      {{ getRatingCount('importance', 3, index) }}
                      <span class="percentage" v-if="getRatingCount('importance', 3, index) > 0">
                        ({{ getPercentage('importance', 3, index) }}%)
                      </span>
                    </td>
                    <td :class="getStatsCellClass('importance', 4, index)" class="count-cell">
                      {{ getRatingCount('importance', 4, index) }}
                      <span class="percentage" v-if="getRatingCount('importance', 4, index) > 0">
                        ({{ getPercentage('importance', 4, index) }}%)
                      </span>
                    </td>
                    <td :class="getStatsCellClass('importance', 'NA', index)" class="count-cell">
                      {{ getRatingCount('importance', 'NA', index) }}
                      <span class="percentage" v-if="getRatingCount('importance', 'NA', index) > 0">
                        ({{ getPercentage('importance', 'NA', index) }}%)
                      </span>
                    </td>
                    <td class="total-cell">
                      {{ getTotalCount('importance', index) }}
                    </td>
                    
                    <!-- Implementation counts -->
                    <td :class="getStatsCellClass('implementation', 1, index)" class="count-cell">
                      {{ getRatingCount('implementation', 1, index) }}
                      <span class="percentage" v-if="getRatingCount('implementation', 1, index) > 0">
                        ({{ getPercentage('implementation', 1, index) }}%)
                      </span>
                    </td>
                    <td :class="getStatsCellClass('implementation', 2, index)" class="count-cell">
                      {{ getRatingCount('implementation', 2, index) }}
                      <span class="percentage" v-if="getRatingCount('implementation', 2, index) > 0">
                        ({{ getPercentage('implementation', 2, index) }}%)
                      </span>
                    </td>
                    <td :class="getStatsCellClass('implementation', 3, index)" class="count-cell">
                      {{ getRatingCount('implementation', 3, index) }}
                      <span class="percentage" v-if="getRatingCount('implementation', 3, index) > 0">
                        ({{ getPercentage('implementation', 3, index) }}%)
                      </span>
                    </td>
                    <td :class="getStatsCellClass('implementation', 4, index)" class="count-cell">
                      {{ getRatingCount('implementation', 4, index) }}
                      <span class="percentage" v-if="getRatingCount('implementation', 4, index) > 0">
                        ({{ getPercentage('implementation', 4, index) }}%)
                      </span>
                    </td>
                    <td :class="getStatsCellClass('implementation', 'NA', index)" class="count-cell">
                      {{ getRatingCount('implementation', 'NA', index) }}
                      <span class="percentage" v-if="getRatingCount('implementation', 'NA', index) > 0">
                        ({{ getPercentage('implementation', 'NA', index) }}%)
                      </span>
                    </td>
                    <td class="total-cell">
                      {{ getTotalCount('implementation', index) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Summary Statistics -->
            <div class="summary-stats mt-6">
              <h4>📈 Summary Overview</h4>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">{{ responses.length }}</div>
                  <div class="stat-label">Total Respondents</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ getAverageRating('importance').toFixed(1) }}</div>
                  <div class="stat-label">Avg Importance</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ getAverageRating('implementation').toFixed(1) }}</div>
                  <div class="stat-label">Avg Implementation</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ getCompletionRate() }}%</div>
                  <div class="stat-label">Completion Rate</div>
                </div>
              </div>
            </div>

            <!-- Rating Distribution Charts -->
            <div class="distribution-charts mt-6">
              <h4>📊 Overall Rating Distribution</h4>
              <div class="charts-grid">
                <div class="chart-container">
                  <h5>Importance Ratings</h5>
                  <div class="chart-bars">
                    <div v-for="rating in [1,2,3,4,'NA']" :key="'imp-chart-'+rating" class="chart-bar-container">
                      <div class="chart-label">{{ rating }}</div>
                      <div class="chart-bar-wrapper">
                        <div 
                          class="chart-bar importance-bar" 
                          :style="{ height: getChartHeight('importance', rating) + '%' }"
                          :title="`${getRatingCount('importance', rating)} responses (${getPercentage('importance', rating)}%)`"
                        >
                          <span class="chart-count">{{ getRatingCount('importance', rating) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chart-container">
                  <h5>Implementation Ratings</h5>
                  <div class="chart-bars">
                    <div v-for="rating in [1,2,3,4,'NA']" :key="'impl-chart-'+rating" class="chart-bar-container">
                      <div class="chart-label">{{ rating }}</div>
                      <div class="chart-bar-wrapper">
                        <div 
                          class="chart-bar implementation-bar" 
                          :style="{ height: getChartHeight('implementation', rating) + '%' }"
                          :title="`${getRatingCount('implementation', rating)} responses (${getPercentage('implementation', rating)}%)`"
                        >
                          <span class="chart-count">{{ getRatingCount('implementation', rating) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    <!-- Quadrant Matrix Section -->
<div v-if="responses.length && activeTab !== 'quadrant'" class="quadrant-section mt-8">
  <h3>🎯 Importance vs Implementation Matrix</h3>
  <p class="text-sm text-gray-600 mb-6">
    Classification of HR items based on assessment data
  </p>
  
  <!-- Quadrant Cards - COMPLETELY SEPARATE CONTAINER -->
  <div class="quadrant-cards-container mb-8">
    <div class="matrix-grid">
      <!-- Q1: Fix & Improve (High Importance, Low Implementation) -->
      <div class="quadrant-card quadrant-1">
        <div class="quadrant-header">
          <h4>Q1: Fix & Improve</h4>
          <span class="quadrant-desc">High Importance, Low Implementation</span>
        </div>
        <div class="quadrant-content">
          <div v-for="hrCode in getQuadrantItems('q1')" :key="hrCode" class="hr-item">
            {{ hrCode }}
            <span class="item-count">({{ getItemCount(hrCode) }})</span>
          </div>
          <div v-if="getQuadrantItems('q1').length === 0" class="no-items">
            No items
          </div>
        </div>
      </div>
      
      <!-- Q2: Maintain & Sustain (High Importance, High Implementation) -->
      <div class="quadrant-card quadrant-2">
        <div class="quadrant-header">
          <h4>Q2: Maintain & Sustain</h4>
          <span class="quadrant-desc">High Importance, High Implementation</span>
        </div>
        <div class="quadrant-content">
          <div v-for="hrCode in getQuadrantItems('q2')" :key="hrCode" class="hr-item">
            {{ hrCode }}
            <span class="item-count">({{ getItemCount(hrCode) }})</span>
          </div>
          <div v-if="getQuadrantItems('q2').length === 0" class="no-items">
            No items
          </div>
        </div>
      </div>
      
      <!-- Q3: Leave Alone (Low Importance, Low Implementation) -->
      <div class="quadrant-card quadrant-3">
        <div class="quadrant-header">
          <h4>Q3: Leave Alone</h4>
          <span class="quadrant-desc">Low Importance, Low Implementation</span>
        </div>
        <div class="quadrant-content">
          <div v-for="hrCode in getQuadrantItems('q3')" :key="hrCode" class="hr-item">
            {{ hrCode }}
            <span class="item-count">({{ getItemCount(hrCode) }})</span>
          </div>
          <div v-if="getQuadrantItems('q3').length === 0" class="no-items">
            No items
          </div>
        </div>
      </div>
      
      <!-- Q4: Review to Maintain or Abolish (Low Importance, High Implementation) -->
      <div class="quadrant-card quadrant-4">
        <div class="quadrant-header">
          <h4>Q4: Review to Maintain or Abolish</h4>
          <span class="quadrant-desc">Low Importance, High Implementation</span>
        </div>
        <div class="quadrant-content">
          <div v-for="hrCode in getQuadrantItems('q4')" :key="hrCode" class="hr-item">
            {{ hrCode }}
            <span class="item-count">({{ getItemCount(hrCode) }})</span>
          </div>
          <div v-if="getQuadrantItems('q4').length === 0" class="no-items">
            No items
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quadrant Legend -->
    <div class="quadrant-legend">
      <div class="legend-axis">
        <span class="axis-label low">Low Implementation</span>
        <span class="axis-label high">High Implementation</span>
      </div>
      <div class="legend-axis vertical">
        <span class="axis-label high">High Importance</span>
        <span class="axis-label low">Low Importance</span>
      </div>
    </div>
  </div>
  
  <!-- Detailed Breakdown - COMPLETELY SEPARATE CONTAINER -->
  <div class="breakdown-container">
    <h4>📋 Detailed Quadrant Breakdown</h4>
    <div class="export-section mt-4 mb-4">
      <button @click="exportQuadrantBreakdown" class="export-btn bg-blue-600 hover:bg-blue-700">
        📥 Export Quadrant Breakdown
      </button>
    </div>
    <div class="breakdown-table">
      <table>
        <thead>
          <tr>
            <th>HR Item</th>
            <th>Q1 Count</th>
            <th>Q2 Count</th>
            <th>Q3 Count</th>
            <th>Q4 Count</th>
            <th>Total Assessments</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hrCode in getAllHRItems()" :key="hrCode">
            <td class="font-medium">{{ hrCode }}</td>
            <td>{{ quadrantData[hrCode]?.q1 || 0 }}</td>
            <td>{{ quadrantData[hrCode]?.q2 || 0 }}</td>
            <td>{{ quadrantData[hrCode]?.q3 || 0 }}</td>
            <td>{{ quadrantData[hrCode]?.q4 || 0 }}</td>
            <td class="font-medium">
              {{ getTotalAssessments(hrCode) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Combined Quadrant Analysis -->
<div v-if="activeTab === 'quadrant' && responses.length" class="quadrant-analysis-section">
  <h3>🎯 Combined Quadrant Analysis</h3>
  <p class="text-sm text-gray-600 mb-6">
    Combined analysis across all survey types
  </p>
  
  <!-- Export Buttons for Quadrant Analysis -->
  <div class="export-grid mb-6">
    <div class="export-section">
      <button @click="exportQuadrantAnalysisToCSV" class="export-btn bg-purple-600 hover:bg-purple-700">
        📊 Export All Quadrant Analysis (Excel)
      </button>
      <span class="text-sm text-gray-600 ml-4">
        All sections in one Excel file
      </span>
    </div>
    
    <div class="export-section mt-4">
      <button @click="exportCombinedQuadrantAnalysis" class="export-btn bg-indigo-600 hover:bg-indigo-700">
        📋 Export Combined Quadrant Analysis
      </button>
      <button @click="exportCombinedQuadrantBreakdown" class="export-btn bg-blue-600 hover:bg-blue-700 ml-2">
        📊 Export Combined Quadrant Breakdown
      </button>
      <button @click="exportQuadrantSubmissionSources" class="export-btn bg-green-600 hover:bg-green-700 ml-2">
        📈 Export Quadrant Submission Sources
      </button>
      <button @click="exportQuadrantDistributionCharts" class="export-btn bg-orange-600 hover:bg-orange-700 ml-2">
        📉 Export Quadrant Distribution Charts
      </button>
      <button @click="exportTotalAssessments" class="export-btn bg-red-600 hover:bg-red-700 ml-2">
        🎯 Export Total Assessments
      </button>
    </div>
  </div>
  
  <!-- Quadrant Cards - COMPLETELY SEPARATE CONTAINER -->
  <div class="quadrant-cards-container mb-8">
    <div class="matrix-grid">
      <!-- Q1: Fix & Improve -->
      <div class="quadrant-card quadrant-1">
        <div class="quadrant-header">
          <h4>Q1: Fix & Improve</h4>
          <span class="quadrant-desc">High Importance, Low Implementation</span>
        </div>
        <div class="quadrant-content">
          <div v-for="hrCode in getCombinedQuadrantItems('q1')" :key="hrCode" class="hr-item">
            {{ hrCode }}
            <span class="item-count">({{ getCombinedItemCount(hrCode) }})</span>
             <!-- ADD THIS CHART GRID HERE -->
      <div class="quadrant-item-chart">
        <div class="chart-bars small">
          <div v-for="(quad, quadKey) in ['q1', 'q2', 'q3', 'q4']" :key="quadKey" 
               class="chart-bar-container small">
            <div class="chart-label">{{ quad.toUpperCase().replace('Q', '') }}</div>
            <div class="chart-bar-wrapper small">
              <div 
                class="chart-bar quadrant-bar" 
                :class="`quadrant-${quad.replace('q', '')}`"
                :style="{ 
                  height: getQuadrantChartPercentage(
                    getQuadrantChartData(hrCode, combinedQuadrantData)[quad], 
                    getQuadrantChartData(hrCode, combinedQuadrantData).total
                  ) + '%' 
                }"
                :title="`${quad.toUpperCase()}: ${getQuadrantChartData(hrCode, combinedQuadrantData)[quad]} assessments`"
              >
                <span class="chart-count small">{{ getQuadrantChartData(hrCode, combinedQuadrantData)[quad] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END OF CHART GRID -->
          </div>
          <div v-if="getCombinedQuadrantItems('q1').length === 0" class="no-items">
            No items
          </div>
        </div>
      </div>
      
      <!-- Q2: Maintain & Sustain -->
      <div class="quadrant-card quadrant-2">
        <div class="quadrant-header">
          <h4>Q2: Maintain & Sustain</h4>
          <span class="quadrant-desc">High Importance, High Implementation</span>
        </div>
        <div class="quadrant-content">
          <div v-for="hrCode in getCombinedQuadrantItems('q2')" :key="hrCode" class="hr-item">
            {{ hrCode }}
            <span class="item-count">({{ getCombinedItemCount(hrCode) }})</span>
             <!-- ADD THIS CHART GRID HERE -->
      <div class="quadrant-item-chart">
        <div class="chart-bars small">
          <div v-for="(quad, quadKey) in ['q1', 'q2', 'q3', 'q4']" :key="quadKey" 
               class="chart-bar-container small">
            <div class="chart-label">{{ quad.toUpperCase().replace('Q', '') }}</div>
            <div class="chart-bar-wrapper small">
              <div 
                class="chart-bar quadrant-bar" 
                :class="`quadrant-${quad.replace('q', '')}`"
                :style="{ 
                  height: getQuadrantChartPercentage(
                    getQuadrantChartData(hrCode, combinedQuadrantData)[quad], 
                    getQuadrantChartData(hrCode, combinedQuadrantData).total
                  ) + '%' 
                }"
                :title="`${quad.toUpperCase()}: ${getQuadrantChartData(hrCode, combinedQuadrantData)[quad]} assessments`"
              >
                <span class="chart-count small">{{ getQuadrantChartData(hrCode, combinedQuadrantData)[quad] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END OF CHART GRID -->
          </div>
          <div v-if="getCombinedQuadrantItems('q2').length === 0" class="no-items">
            No items
          </div>
        </div>
      </div>
      
      <!-- Q3: Leave Alone -->
      <div class="quadrant-card quadrant-3">
        <div class="quadrant-header">
          <h4>Q3: Leave Alone</h4>
          <span class="quadrant-desc">Low Importance, Low Implementation</span>
        </div>
        <div class="quadrant-content">
          <div v-for="hrCode in getCombinedQuadrantItems('q3')" :key="hrCode" class="hr-item">
            {{ hrCode }}
            <span class="item-count">({{ getCombinedItemCount(hrCode) }})</span>
             <!-- ADD THIS CHART GRID HERE -->
      <div class="quadrant-item-chart">
        <div class="chart-bars small">
          <div v-for="(quad, quadKey) in ['q1', 'q2', 'q3', 'q4']" :key="quadKey" 
               class="chart-bar-container small">
            <div class="chart-label">{{ quad.toUpperCase().replace('Q', '') }}</div>
            <div class="chart-bar-wrapper small">
              <div 
                class="chart-bar quadrant-bar" 
                :class="`quadrant-${quad.replace('q', '')}`"
                :style="{ 
                  height: getQuadrantChartPercentage(
                    getQuadrantChartData(hrCode, combinedQuadrantData)[quad], 
                    getQuadrantChartData(hrCode, combinedQuadrantData).total
                  ) + '%' 
                }"
                :title="`${quad.toUpperCase()}: ${getQuadrantChartData(hrCode, combinedQuadrantData)[quad]} assessments`"
              >
                <span class="chart-count small">{{ getQuadrantChartData(hrCode, combinedQuadrantData)[quad] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END OF CHART GRID -->
          </div>
          <div v-if="getCombinedQuadrantItems('q3').length === 0" class="no-items">
            No items
          </div>
        </div>
      </div>
      
      <!-- Q4: Review to Maintain or Abolish -->
      <div class="quadrant-card quadrant-4">
        <div class="quadrant-header">
          <h4>Q4: Review to Maintain or Abolish</h4>
          <span class="quadrant-desc">Low Importance, High Implementation</span>
        </div>
        <div class="quadrant-content">
          <div v-for="hrCode in getCombinedQuadrantItems('q4')" :key="hrCode" class="hr-item">
            {{ hrCode }}
            <span class="item-count">({{ getCombinedItemCount(hrCode) }})</span>
             <!-- ADD THIS CHART GRID HERE -->
      <div class="quadrant-item-chart">
        <div class="chart-bars small">
          <div v-for="(quad, quadKey) in ['q1', 'q2', 'q3', 'q4']" :key="quadKey" 
               class="chart-bar-container small">
            <div class="chart-label">{{ quad.toUpperCase().replace('Q', '') }}</div>
            <div class="chart-bar-wrapper small">
              <div 
                class="chart-bar quadrant-bar" 
                :class="`quadrant-${quad.replace('q', '')}`"
                :style="{ 
                  height: getQuadrantChartPercentage(
                    getQuadrantChartData(hrCode, combinedQuadrantData)[quad], 
                    getQuadrantChartData(hrCode, combinedQuadrantData).total
                  ) + '%' 
                }"
                :title="`${quad.toUpperCase()}: ${getQuadrantChartData(hrCode, combinedQuadrantData)[quad]} assessments`"
              >
                <span class="chart-count small">{{ getQuadrantChartData(hrCode, combinedQuadrantData)[quad] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END OF CHART GRID -->
          </div>
          <div v-if="getCombinedQuadrantItems('q4').length === 0" class="no-items">
            No items
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Combined Breakdown - COMPLETELY SEPARATE CONTAINER -->
  <div class="breakdown-container">
    <h4>📋 Combined Quadrant Breakdown</h4>
    <div class="export-section mt-4 mb-4">
      <button @click="exportCombinedQuadrantBreakdown" class="export-btn bg-blue-600 hover:bg-blue-700">
        📥 Export Combined Quadrant Breakdown
      </button>
    </div>
    <div class="breakdown-table">
      <table>
        <thead>
          <tr>
            <th>HR Item</th>         
            <th>Q1: Fix & Improve</th>
            <th>Q2: Maintain & Sustain</th>
            <th>Q3: Leave Alone</th>
            <th>Q4: Review to Maintain or Abolish</th>
            <th>Total Assessments</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hrCode in getAllCombinedHRItems()" :key="hrCode">
            <td class="font-medium">{{ hrCode }}</td>
            <td>{{ combinedQuadrantData[hrCode]?.q1 || 0 }}</td>
            <td>{{ combinedQuadrantData[hrCode]?.q2 || 0 }}</td>
            <td>{{ combinedQuadrantData[hrCode]?.q3 || 0 }}</td>
            <td>{{ combinedQuadrantData[hrCode]?.q4 || 0 }}</td>
            <td class="font-medium">
              {{ getCombinedTotalAssessments(hrCode) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

<div class="quadrant-submissions-section mt-8">
  <h4>📊 Quadrant Submission Sources</h4>
  <p class="text-sm text-gray-600 mb-6">
    Percentage breakdown of which survey types contributed to each quadrant
  </p>
  
  <div class="export-section mt-4 mb-4">
    <button @click="exportQuadrantSubmissionSources" class="export-btn bg-green-600 hover:bg-green-700">
      📥 Export Quadrant Submission Sources
    </button>
  </div>
  
  <div class="submissions-table">
    <table>
      <thead>
        <tr>
          <th>Quadrant</th>
          <th>Description</th>
          <th>Management Assessment</th>
          <th>HR Self-Assessment</th>
          <th>User Survey</th>
          <th>Total Assessments</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="quadrant in ['q1', 'q2', 'q3', 'q4']" :key="quadrant">
          <td class="font-medium">{{ getQuadrantDisplayName(quadrant) }}</td>
          <td class="quadrant-desc-cell">{{ getQuadrantDescription(quadrant) }}</td>
          <td :style="getQuadrantPercentageStyle(quadrant, 'management')">
            {{ getQuadrantSourcePercentage(quadrant, 'management') }}%
            <span class="count-badge">({{ getQuadrantSourceCount(quadrant, 'management') }})</span>
          </td>
          <td :style="getQuadrantPercentageStyle(quadrant, 'hr')">
            {{ getQuadrantSourcePercentage(quadrant, 'hr') }}%
            <span class="count-badge">({{ getQuadrantSourceCount(quadrant, 'hr') }})</span>
          </td>
          <td :style="getQuadrantPercentageStyle(quadrant, 'survey')">
            {{ getQuadrantSourcePercentage(quadrant, 'survey') }}%
            <span class="count-badge">({{ getQuadrantSourceCount(quadrant, 'survey') }})</span>
          </td>
          <td class="font-medium">
            {{ getQuadrantTotalAssessments(quadrant) }}
          </td>
        </tr>
        
        <!-- Total Row -->
        <tr class="total-row">
          <td colspan="2" class="font-medium text-right">Total:</td>
          <td class="font-medium">{{ getTotalSourceCount('management') }}</td>
          <td class="font-medium">{{ getTotalSourceCount('hr') }}</td>
          <td class="font-medium">{{ getTotalSourceCount('survey') }}</td>
          <td class="font-medium">{{ getOverallTotalAssessments() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

  <!-- Add this section RIGHT AFTER the closing </div> of the breakdown-container -->
<div class="charts-section mt-8">
  <h4>📈 Quadrant Distribution Charts</h4>
  <p class="text-sm text-gray-600 mb-6">Visual breakdown of quadrant assessments per HR item</p>
  
  <div class="export-section mt-4 mb-4">
    <button @click="exportQuadrantDistributionCharts" class="export-btn bg-orange-600 hover:bg-orange-700">
      📥 Export Quadrant Distribution Charts
    </button>
  </div>
  
  <!-- Charts Grid -->
  <div class="charts-grid">
    <!-- Q1 Chart -->
    <div class="chart-card">
      <h5>Q1: Fix & Improve Assessments</h5>
      <p class="chart-subtitle">High Importance, Low Implementation</p>
      <div class="chart-container">
        <div class="chart-y-axis">
          <span>Assessments</span>
        </div>
        <div class="chart-content">
          <div class="chart-bars horizontal">
            <div 
              v-for="hrCode in getAllCombinedHRItems()" 
              :key="'q1-chart-' + hrCode"
              class="chart-bar-wrapper"
            >
              <div class="chart-bar-label">{{ hrCode }}</div>
              <div class="chart-bar-bg">
                <div 
                  class="chart-bar q1-bar"
                  :style="{ width: getChartPercentage(combinedQuadrantData[hrCode]?.q1 || 0, getMaxQ1Value()) + '%' }"
                  :title="`${hrCode}: ${combinedQuadrantData[hrCode]?.q1 || 0} assessments`"
                >
                  <span class="chart-bar-value">{{ combinedQuadrantData[hrCode]?.q1 || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Q2 Chart -->
    <div class="chart-card">
      <h5>Q2: Maintain & Sustain Assessments</h5>
      <p class="chart-subtitle">High Importance, High Implementation</p>
      <div class="chart-container">
        <div class="chart-y-axis">
          <span>Assessments</span>
        </div>
        <div class="chart-content">
          <div class="chart-bars horizontal">
            <div 
              v-for="hrCode in getAllCombinedHRItems()" 
              :key="'q2-chart-' + hrCode"
              class="chart-bar-wrapper"
            >
              <div class="chart-bar-label">{{ hrCode }}</div>
              <div class="chart-bar-bg">
                <div 
                  class="chart-bar q2-bar"
                  :style="{ width: getChartPercentage(combinedQuadrantData[hrCode]?.q2 || 0, getMaxQ2Value()) + '%' }"
                  :title="`${hrCode}: ${combinedQuadrantData[hrCode]?.q2 || 0} assessments`"
                >
                  <span class="chart-bar-value">{{ combinedQuadrantData[hrCode]?.q2 || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Q3 Chart -->
    <div class="chart-card">
      <h5>Q3: Leave Alone Assessments</h5>
      <p class="chart-subtitle">Low Importance, Low Implementation</p>
      <div class="chart-container">
        <div class="chart-y-axis">
          <span>Assessments</span>
        </div>
        <div class="chart-content">
          <div class="chart-bars horizontal">
            <div 
              v-for="hrCode in getAllCombinedHRItems()" 
              :key="'q3-chart-' + hrCode"
              class="chart-bar-wrapper"
            >
              <div class="chart-bar-label">{{ hrCode }}</div>
              <div class="chart-bar-bg">
                <div 
                  class="chart-bar q3-bar"
                  :style="{ width: getChartPercentage(combinedQuadrantData[hrCode]?.q3 || 0, getMaxQ3Value()) + '%' }"
                  :title="`${hrCode}: ${combinedQuadrantData[hrCode]?.q3 || 0} assessments`"
                >
                  <span class="chart-bar-value">{{ combinedQuadrantData[hrCode]?.q3 || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Q4 Chart -->
    <div class="chart-card">
      <h5>Q4: Review to Maintain or Abolish Assessments</h5>
      <p class="chart-subtitle">Low Importance, High Implementation</p>
      <div class="chart-container">
        <div class="chart-y-axis">
          <span>Assessments</span>
        </div>
        <div class="chart-content">
          <div class="chart-bars horizontal">
            <div 
              v-for="hrCode in getAllCombinedHRItems()" 
              :key="'q4-chart-' + hrCode"
              class="chart-bar-wrapper"
            >
              <div class="chart-bar-label">{{ hrCode }}</div>
              <div class="chart-bar-bg">
                <div 
                  class="chart-bar q4-bar"
                  :style="{ width: getChartPercentage(combinedQuadrantData[hrCode]?.q4 || 0, getMaxQ4Value()) + '%' }"
                  :title="`${hrCode}: ${combinedQuadrantData[hrCode]?.q4 || 0} assessments`"
                >
                  <span class="chart-bar-value">{{ combinedQuadrantData[hrCode]?.q4 || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Total Assessments Chart -->
    <div class="chart-card full-width">
      <h5>Total Assessments per HR Item</h5>
      <p class="chart-subtitle">Combined assessments across all quadrants</p>
      <div class="chart-container">
        <div class="chart-y-axis">
          <span>Total Assessments</span>
        </div>
        <div class="chart-content">
          <div class="chart-bars horizontal">
            <div 
              v-for="hrCode in getAllCombinedHRItems()" 
              :key="'total-chart-' + hrCode"
              class="chart-bar-wrapper"
            >
              <div class="chart-bar-label">{{ hrCode }}</div>
              <div class="chart-bar-bg">
                <div 
                  class="chart-bar total-bar"
                  :style="{ width: getChartPercentage(getCombinedTotalAssessments(hrCode), getMaxTotalValue()) + '%' }"
                  :title="`${hrCode}: ${getCombinedTotalAssessments(hrCode)} total assessments`"
                >
                  <span class="chart-bar-value">{{ getCombinedTotalAssessments(hrCode) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";
import * as XLSX from 'xlsx';

export default {
  name: "ResultsDashboard",
  data() {
    return {
      token: localStorage.getItem("token"),
      tabs: [
        { 
          key: "management", 
          label: "Management Assessment", 
          url: "/api/management",
          sections: ['hr1', 'hr2', 'hr3', 'hr4', 'hr5', 'hr6'],
          questions: [
            { text: "HR1.1 Strategic Initiatives" },
            { text: "HR1.2 Team Ratio" },
            { text: "HR1.3 Team Competencies" },
            { text: "HR1.4 HRIS/AI" },
            { text: "HR1.5 Safety & Health" },
            { text: "HR1.6 Crisis Management" },
            { text: "HR2.1 Policies & Handbook" },
            { text: "HR2.2 Communication" },
            { text: "HR3.1 Workforce Planning" },
            { text: "HR3.2 Sourcing" },
            { text: "HR3.3 Selection Tools" },
            { text: "HR3.4 Recruitment Process" },
            { text: "HR3.5 Pre-selection Checks" },
            { text: "HR3.6 Turn-around-Time" },
            { text: "HR3.7 Onboarding" },
            { text: "HR3.8 Career Development" },
            { text: "HR3.9 Headcount Reporting" },
            { text: "HR3.10 Separations" },
            { text: "HR4.1 Compensation & Benefits" },
            { text: "HR4.2 Welfare Programs" },
            { text: "HR4.3 Incentive Pay" },
            { text: "HR4.4 Payroll Management" },
            { text: "HR4.5 Performance System" },
            { text: "HR4.6 Performance Improvement" },
            { text: "HR5.1 Training Administration" },
            { text: "HR5.2 Training Plan" },
            { text: "HR5.3 Training Evaluation" },
            { text: "HR5.4 Knowledge Management" },
            { text: "HR6.1 Manager Relationship" },
            { text: "HR6.2 Employee Relations" },
            { text: "HR6.3 Workplace Programs" },
            { text: "HR6.4 Industrial Relations" },
            { text: "HR6.5 Legal Compliance" },
            { text: "HR6.6 IR Competencies" }
          ]
        },
        { 
          key: "hr", 
          label: "HR Self-Assessment", 
          url: "/api/hr-self-assessment",
          sections: ['hr1', 'hr2', 'hr3', 'hr4', 'hr5', 'hr6'],
          questions: [
            { text: "HR1.1 Strategic Initiatives" },
            { text: "HR1.2 Team Ratio" },
            { text: "HR1.3 Team Competencies" },
            { text: "HR1.4 HRIS/AI" },
            { text: "HR1.5 Safety & Health" },
            { text: "HR1.6 Crisis Management" },
            { text: "HR2.1 Policies & Handbook" },
            { text: "HR2.2 Communication" },
            { text: "HR3.1 Workforce Planning" },
            { text: "HR3.2 Sourcing" },
            { text: "HR3.3 Selection Tools" },
            { text: "HR3.4 Recruitment Process" },
            { text: "HR3.5 Pre-selection Checks" },
            { text: "HR3.6 Turn-around-Time" },
            { text: "HR3.7 Onboarding" },
            { text: "HR3.8 Career Development" },
            { text: "HR3.9 Headcount Reporting" },
            { text: "HR3.10 Separations" },
            { text: "HR4.1 Compensation & Benefits" },
            { text: "HR4.2 Welfare Programs" },
            { text: "HR4.3 Incentive Pay" },
            { text: "HR4.4 Payroll Management" },
            { text: "HR4.5 Performance System" },
            { text: "HR4.6 Performance Improvement" },
            { text: "HR5.1 Training Administration" },
            { text: "HR5.2 Training Plan" },
            { text: "HR5.3 Training Evaluation" },
            { text: "HR5.4 Knowledge Management" },
            { text: "HR6.1 Manager Relationship" },
            { text: "HR6.2 Employee Relations" },
            { text: "HR6.3 Workplace Programs" },
            { text: "HR6.4 Industrial Relations" },
            { text: "HR6.5 Legal Compliance" },
            { text: "HR6.6 IR Competencies" }
          ]
        },
        { 
          key: "survey", 
          label: "User Survey", 
          url: "/api/user-survey",
          sections: ['hr1', 'hr2', 'hr3', 'hr4', 'hr5', 'hr6'],
          questions: [
            { text: "HR1.1 Management & Initiatives" },
            { text: "HR1.2 HRIS/AI" },
            { text: "HR1.3 Safety & Health" },
            { text: "HR1.4 Crisis Management" },
            { text: "HR2.1 Policies & Handbook" },
            { text: "HR2.2 Communication" },
            { text: "HR3.1 Workforce Planning" },
            { text: "HR3.2 Sourcing" },
            { text: "HR3.3 Recruitment Process" },
            { text: "HR3.4 Pre-selection Checks" },
            { text: "HR3.5 Turn-around-Time" },
            { text: "HR3.6 Onboarding" },
            { text: "HR3.7 Career Development" },
            { text: "HR3.8 Headcount Reporting" },
            { text: "HR4.1 Compensation & Benefits" },
            { text: "HR4.2 Welfare Programs" },
            { text: "HR4.3 Incentive Pay" },
            { text: "HR4.4 Payroll Administration" },
            { text: "HR4.5 Performance System" },
            { text: "HR4.6 Performance Improvement" },
            { text: "HR5.1 Training Administration" },
            { text: "HR5.2 Training Evaluation" },
            { text: "HR5.3 Knowledge Management" },
            { text: "HR6.1 Manager Relationship" },
            { text: "HR6.2 Employee Relations" },
            { text: "HR6.3 Workplace Programs" },
            { text: "HR6.4 Industrial Relations" }
          ],
          // Mapping for User Survey to handle missing questions
          hrMappings: {
            hr1: {
              0: 'HR1.1',  // HR1.1 Management & Initiatives
              1: 'HR1.4',  // HR1.2 in survey is actually HR1.4 (HRIS/AI)
              2: 'HR1.5',  // HR1.3 in survey is actually HR1.5 (Safety & Health)
              3: 'HR1.6'   // HR1.4 in survey is actually HR1.6 (Crisis Management)
            },
            hr2: {
              0: 'HR2.1',
              1: 'HR2.2'
            },
            hr3: {
              0: 'HR3.1',  // HR3.1 Workforce Planning
              1: 'HR3.2',  // HR3.2 Sourcing
              2: 'HR3.4',  // HR3.3 in survey is actually HR3.4 (Recruitment Process)
              3: 'HR3.5',  // HR3.4 in survey is actually HR3.5 (Pre-selection Checks)
              4: 'HR3.6',  // HR3.5 in survey is actually HR3.6 (Turn-around-Time)
              5: 'HR3.7',  // HR3.6 in survey is actually HR3.7 (Onboarding)
              6: 'HR3.8',  // HR3.7 in survey is actually HR3.8 (Career Development)
              7: 'HR3.9'   // HR3.8 in survey is actually HR3.9 (Headcount Reporting)
            },
            hr4: {
              0: 'HR4.1',
              1: 'HR4.2',
              2: 'HR4.3',
              3: 'HR4.4',
              4: 'HR4.5',
              5: 'HR4.6'
            },
            hr5: {
              0: 'HR5.1',  // HR5.1 Training Administration
              1: 'HR5.3',  // HR5.2 in survey is actually HR5.3 (Training Evaluation)
              2: 'HR5.4'   // HR5.3 in survey is actually HR5.4 (Knowledge Management)
            },
            hr6: {
              0: 'HR6.1',  // HR6.1 Manager Relationship
              1: 'HR6.2',  // HR6.2 Employee Relations
              2: 'HR6.3',  // HR6.3 Workplace Programs
              3: 'HR6.4'   // HR6.4 Industrial Relations
            }
          }
        },
        { 
          key: "quadrant", 
          label: "Quadrant Analysis", 
          url: "/api/all-responses",
          sections: [],
          questions: []
        }
      ],
      activeTab: "management",
      activeStatsSection: "hr1",
      responses: [],
      selectedResponse: null,
      fetchError: null,
      allResponses: []
    };
  },
  computed: {
    currentTabLabel() {
      return this.tabs.find(tab => tab.key === this.activeTab)?.label || "";
    },
    currentTab() {
      return this.tabs.find(tab => tab.key === this.activeTab);
    },
    currentSections() {
      return this.currentTab?.sections || [];
    },
    currentQuestions() {
      return this.currentTab?.questions || [];
    },
    showPositionColumn() {
      return this.activeTab !== 'management';
    },
    showDepartmentColumn() {
      return this.activeTab === 'survey';
    },
    showDateJoinedColumn() {
      return this.activeTab !== 'management';
    },
    showObstaclesColumn() {
      return true;
    },
    showSuggestionsColumn() {
      return this.activeTab === 'survey';
    },
    showStrengthsColumn() {
      return this.activeTab !== 'survey';
    },
    basicHeaders() {
      let headers = 5;
      if (!this.showPositionColumn) headers--;
      if (!this.showDepartmentColumn) headers--;
      if (!this.showDateJoinedColumn) headers--;
      return headers;
    },
    quadrantData() {
      return this.calculateQuadrantData(this.responses);
    },
    combinedQuadrantData() {
      return this.calculateQuadrantData(this.allResponses);
    }
  },
  methods: {
    // 1. Export Combined Quadrant Analysis (Individual)
    exportCombinedQuadrantAnalysis() {
      try {
        const data = [];
        const headers = [
          'HR Item',
          'Assigned Quadrant',
          'Q1: Fix & Improve',
          'Q2: Maintain & Sustain',
          'Q3: Leave Alone',
          'Q4: Review to Maintain or Abolish',
          'Total Assessments'
        ];
        
        data.push(headers);
        
        const allHRItems = this.getAllCombinedHRItems();
        allHRItems.forEach(hrCode => {
          const counts = this.combinedQuadrantData[hrCode] || { q1: 0, q2: 0, q3: 0, q4: 0 };
          const assignedQuadrant = this.getCombinedFinalQuadrant(hrCode) || 'Unassigned';
          const quadrantDisplay = {
            'q1': 'Q1: Fix & Improve',
            'q2': 'Q2: Maintain & Sustain',
            'q3': 'Q3: Leave Alone',
            'q4': 'Q4: Review to Maintain or Abolish',
            'Unassigned': 'Unassigned'
          }[assignedQuadrant];
          
          data.push([
            hrCode,
            quadrantDisplay,
            counts.q1 || 0,
            counts.q2 || 0,
            counts.q3 || 0,
            counts.q4 || 0,
            (counts.q1 || 0) + (counts.q2 || 0) + (counts.q3 || 0) + (counts.q4 || 0)
          ]);
        });
        
        this.exportToExcel(data, 'Combined_Quadrant_Analysis');
        
      } catch (error) {
        console.error('Error exporting combined quadrant analysis:', error);
        alert('Error exporting combined quadrant analysis: ' + error.message);
      }
    },

    // 2. Export Combined Quadrant Breakdown (Individual)
    exportCombinedQuadrantBreakdown() {
      try {
        const data = [];
        const headers = [
          'HR Item',
          'Q1 Count',
          'Q2 Count',
          'Q3 Count',
          'Q4 Count',
          'Total Assessments',
          'Q1 Percentage',
          'Q2 Percentage',
          'Q3 Percentage',
          'Q4 Percentage'
        ];
        
        data.push(headers);
        
        const allHRItems = this.getAllCombinedHRItems();
        allHRItems.forEach(hrCode => {
          const counts = this.combinedQuadrantData[hrCode] || { q1: 0, q2: 0, q3: 0, q4: 0 };
          const total = (counts.q1 || 0) + (counts.q2 || 0) + (counts.q3 || 0) + (counts.q4 || 0);
          
          data.push([
            hrCode,
            counts.q1 || 0,
            counts.q2 || 0,
            counts.q3 || 0,
            counts.q4 || 0,
            total,
            total > 0 ? ((counts.q1 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q2 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q3 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q4 || 0) / total * 100).toFixed(2) + '%' : '0%'
          ]);
        });
        
        this.exportToExcel(data, 'Combined_Quadrant_Breakdown');
        
      } catch (error) {
        console.error('Error exporting combined quadrant breakdown:', error);
        alert('Error exporting combined quadrant breakdown: ' + error.message);
      }
    },

    // 3. Export Quadrant Submission Sources (Individual)
    exportQuadrantSubmissionSources() {
      try {
        const data = [];
        const headers = [
          'Quadrant',
          'Description',
          'Management Assessment',
          'HR Self-Assessment',
          'User Survey',
          'Total Assessments',
          'Management %',
          'HR %',
          'User Survey %'
        ];
        
        data.push(headers);
        
        const quadrantSourceData = this.calculateQuadrantSourceData();
        const quadrants = ['q1', 'q2', 'q3', 'q4'];
        
        quadrants.forEach(quadrant => {
          const sourceData = quadrantSourceData[quadrant];
          const total = sourceData.total || 0;
          
          data.push([
            this.getQuadrantDisplayName(quadrant),
            this.getQuadrantDescription(quadrant),
            sourceData.management || 0,
            sourceData.hr || 0,
            sourceData.survey || 0,
            total,
            total > 0 ? ((sourceData.management || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((sourceData.hr || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((sourceData.survey || 0) / total * 100).toFixed(2) + '%' : '0%'
          ]);
        });
        
        // Add totals row
        const overallTotal = this.getOverallTotalAssessments();
        data.push([
          'TOTAL',
          '',
          this.getTotalSourceCount('management'),
          this.getTotalSourceCount('hr'),
          this.getTotalSourceCount('survey'),
          overallTotal,
          overallTotal > 0 ? (this.getTotalSourceCount('management') / overallTotal * 100).toFixed(2) + '%' : '0%',
          overallTotal > 0 ? (this.getTotalSourceCount('hr') / overallTotal * 100).toFixed(2) + '%' : '0%',
          overallTotal > 0 ? (this.getTotalSourceCount('survey') / overallTotal * 100).toFixed(2) + '%' : '0%'
        ]);
        
        this.exportToExcel(data, 'Quadrant_Submission_Sources');
        
      } catch (error) {
        console.error('Error exporting quadrant submission sources:', error);
        alert('Error exporting quadrant submission sources: ' + error.message);
      }
    },

    // 4. Export Quadrant Distribution Charts (Individual)
    exportQuadrantDistributionCharts() {
      try {
        const data = [];
        const headers = [
          'HR Item',
          'Q1: Fix & Improve Count',
          'Q2: Maintain & Sustain Count',
          'Q3: Leave Alone Count',
          'Q4: Review to Maintain or Abolish Count',
          'Q1 Percentage of Max',
          'Q2 Percentage of Max',
          'Q3 Percentage of Max',
          'Q4 Percentage of Max'
        ];
        
        data.push(headers);
        
        const maxValues = {
          q1: this.getMaxQ1Value(),
          q2: this.getMaxQ2Value(),
          q3: this.getMaxQ3Value(),
          q4: this.getMaxQ4Value()
        };
        
        const allHRItems = this.getAllCombinedHRItems();
        allHRItems.forEach(hrCode => {
          const counts = this.combinedQuadrantData[hrCode] || { q1: 0, q2: 0, q3: 0, q4: 0 };
          
          data.push([
            hrCode,
            counts.q1 || 0,
            counts.q2 || 0,
            counts.q3 || 0,
            counts.q4 || 0,
            maxValues.q1 > 0 ? ((counts.q1 || 0) / maxValues.q1 * 100).toFixed(2) + '%' : '0%',
            maxValues.q2 > 0 ? ((counts.q2 || 0) / maxValues.q2 * 100).toFixed(2) + '%' : '0%',
            maxValues.q3 > 0 ? ((counts.q3 || 0) / maxValues.q3 * 100).toFixed(2) + '%' : '0%',
            maxValues.q4 > 0 ? ((counts.q4 || 0) / maxValues.q4 * 100).toFixed(2) + '%' : '0%'
          ]);
        });
        
        this.exportToExcel(data, 'Quadrant_Distribution_Charts');
        
      } catch (error) {
        console.error('Error exporting quadrant distribution charts:', error);
        alert('Error exporting quadrant distribution charts: ' + error.message);
      }
    },

    // 5. Export Total Assessments per HR Item (Individual)
    exportTotalAssessments() {
      try {
        const data = [];
        const headers = [
          'HR Item',
          'Total Assessments',
          'Q1 Count',
          'Q2 Count',
          'Q3 Count',
          'Q4 Count',
          'Q1 Percentage of Total',
          'Q2 Percentage of Total',
          'Q3 Percentage of Total',
          'Q4 Percentage of Total'
        ];
        
        data.push(headers);
        
        const allHRItems = this.getAllCombinedHRItems();
        allHRItems.forEach(hrCode => {
          const counts = this.combinedQuadrantData[hrCode] || { q1: 0, q2: 0, q3: 0, q4: 0 };
          const total = this.getCombinedTotalAssessments(hrCode);
          
          data.push([
            hrCode,
            total,
            counts.q1 || 0,
            counts.q2 || 0,
            counts.q3 || 0,
            counts.q4 || 0,
            total > 0 ? ((counts.q1 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q2 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q3 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q4 || 0) / total * 100).toFixed(2) + '%' : '0%'
          ]);
        });
        
        this.exportToExcel(data, 'Total_Assessments_per_HR_Item');
        
      } catch (error) {
        console.error('Error exporting total assessments:', error);
        alert('Error exporting total assessments: ' + error.message);
      }
    },

    // 6. Export Quadrant Breakdown (for individual survey tabs)
    exportQuadrantBreakdown() {
      try {
        const data = [];
        const headers = [
          'HR Item',
          'Q1 Count',
          'Q2 Count',
          'Q3 Count',
          'Q4 Count',
          'Total Assessments',
          'Q1 Percentage',
          'Q2 Percentage',
          'Q3 Percentage',
          'Q4 Percentage'
        ];
        
        data.push(headers);
        
        const allHRItems = this.getAllHRItems();
        allHRItems.forEach(hrCode => {
          const counts = this.quadrantData[hrCode] || { q1: 0, q2: 0, q3: 0, q4: 0 };
          const total = this.getTotalAssessments(hrCode);
          
          data.push([
            hrCode,
            counts.q1 || 0,
            counts.q2 || 0,
            counts.q3 || 0,
            counts.q4 || 0,
            total,
            total > 0 ? ((counts.q1 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q2 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q3 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q4 || 0) / total * 100).toFixed(2) + '%' : '0%'
          ]);
        });
        
        this.exportToExcel(data, `${this.currentTabLabel}_Quadrant_Breakdown`);
        
      } catch (error) {
        console.error('Error exporting quadrant breakdown:', error);
        alert('Error exporting quadrant breakdown: ' + error.message);
      }
    },

    // Helper method to export data to Excel
    exportToExcel(data, sheetName) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      // Auto-size columns
      const wscols = [];
      if (data.length > 0) {
        for (let i = 0; i < data[0].length; i++) {
          wscols.push({ wch: 20 });
        }
        ws['!cols'] = wscols;
      }
      
      const fileName = `${sheetName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      alert(`${sheetName} exported successfully!`);
    },

    // 7. Combined export (all in one Excel file with multiple sheets)
    exportQuadrantAnalysisToCSV() {
      try {
        const wb = XLSX.utils.book_new();
        
        // Sheet 1: Combined Quadrant Analysis
        const combinedData = [];
        const headers1 = [
          'HR Item',
          'Assigned Quadrant',
          'Q1: Fix & Improve',
          'Q2: Maintain & Sustain',
          'Q3: Leave Alone',
          'Q4: Review to Maintain or Abolish',
          'Total Assessments'
        ];
        combinedData.push(headers1);
        const allHRItems = this.getAllCombinedHRItems();
        allHRItems.forEach(hrCode => {
          const counts = this.combinedQuadrantData[hrCode] || { q1: 0, q2: 0, q3: 0, q4: 0 };
          const assignedQuadrant = this.getCombinedFinalQuadrant(hrCode) || 'Unassigned';
          const quadrantDisplay = {
            'q1': 'Q1: Fix & Improve',
            'q2': 'Q2: Maintain & Sustain',
            'q3': 'Q3: Leave Alone',
            'q4': 'Q4: Review to Maintain or Abolish',
            'Unassigned': 'Unassigned'
          }[assignedQuadrant];
          
          combinedData.push([
            hrCode,
            quadrantDisplay,
            counts.q1 || 0,
            counts.q2 || 0,
            counts.q3 || 0,
            counts.q4 || 0,
            (counts.q1 || 0) + (counts.q2 || 0) + (counts.q3 || 0) + (counts.q4 || 0)
          ]);
        });
        const ws1 = XLSX.utils.aoa_to_sheet(combinedData);
        XLSX.utils.book_append_sheet(wb, ws1, 'Combined Quadrant Analysis');
        
        // Sheet 2: Combined Quadrant Breakdown
        const breakdownData = [];
        const headers2 = [
          'HR Item',
          'Q1 Count',
          'Q2 Count',
          'Q3 Count',
          'Q4 Count',
          'Total Assessments',
          'Q1 Percentage',
          'Q2 Percentage',
          'Q3 Percentage',
          'Q4 Percentage'
        ];
        breakdownData.push(headers2);
        allHRItems.forEach(hrCode => {
          const counts = this.combinedQuadrantData[hrCode] || { q1: 0, q2: 0, q3: 0, q4: 0 };
          const total = (counts.q1 || 0) + (counts.q2 || 0) + (counts.q3 || 0) + (counts.q4 || 0);
          
          breakdownData.push([
            hrCode,
            counts.q1 || 0,
            counts.q2 || 0,
            counts.q3 || 0,
            counts.q4 || 0,
            total,
            total > 0 ? ((counts.q1 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q2 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q3 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q4 || 0) / total * 100).toFixed(2) + '%' : '0%'
          ]);
        });
        const ws2 = XLSX.utils.aoa_to_sheet(breakdownData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Combined Quadrant Breakdown');
        
        // Sheet 3: Quadrant Submission Sources
        const sourceData = [];
        const headers3 = [
          'Quadrant',
          'Description',
          'Management Assessment',
          'HR Self-Assessment',
          'User Survey',
          'Total Assessments',
          'Management %',
          'HR %',
          'User Survey %'
        ];
        sourceData.push(headers3);
        const quadrantSourceData = this.calculateQuadrantSourceData();
        const quadrants = ['q1', 'q2', 'q3', 'q4'];
        quadrants.forEach(quadrant => {
          const data = quadrantSourceData[quadrant];
          const total = data.total || 0;
          
          sourceData.push([
            this.getQuadrantDisplayName(quadrant),
            this.getQuadrantDescription(quadrant),
            data.management || 0,
            data.hr || 0,
            data.survey || 0,
            total,
            total > 0 ? ((data.management || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((data.hr || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((data.survey || 0) / total * 100).toFixed(2) + '%' : '0%'
          ]);
        });
        const overallTotal = this.getOverallTotalAssessments();
        sourceData.push([
          'TOTAL',
          '',
          this.getTotalSourceCount('management'),
          this.getTotalSourceCount('hr'),
          this.getTotalSourceCount('survey'),
          overallTotal,
          overallTotal > 0 ? (this.getTotalSourceCount('management') / overallTotal * 100).toFixed(2) + '%' : '0%',
          overallTotal > 0 ? (this.getTotalSourceCount('hr') / overallTotal * 100).toFixed(2) + '%' : '0%',
          overallTotal > 0 ? (this.getTotalSourceCount('survey') / overallTotal * 100).toFixed(2) + '%' : '0%'
        ]);
        const ws3 = XLSX.utils.aoa_to_sheet(sourceData);
        XLSX.utils.book_append_sheet(wb, ws3, 'Quadrant Submission Sources');
        
        // Sheet 4: Quadrant Distribution Charts
        const chartData = [];
        const headers4 = [
          'HR Item',
          'Q1: Fix & Improve Count',
          'Q2: Maintain & Sustain Count',
          'Q3: Leave Alone Count',
          'Q4: Review to Maintain or Abolish Count',
          'Q1 Percentage of Max',
          'Q2 Percentage of Max',
          'Q3 Percentage of Max',
          'Q4 Percentage of Max'
        ];
        chartData.push(headers4);
        const maxValues = {
          q1: this.getMaxQ1Value(),
          q2: this.getMaxQ2Value(),
          q3: this.getMaxQ3Value(),
          q4: this.getMaxQ4Value()
        };
        allHRItems.forEach(hrCode => {
          const counts = this.combinedQuadrantData[hrCode] || { q1: 0, q2: 0, q3: 0, q4: 0 };
          
          chartData.push([
            hrCode,
            counts.q1 || 0,
            counts.q2 || 0,
            counts.q3 || 0,
            counts.q4 || 0,
            maxValues.q1 > 0 ? ((counts.q1 || 0) / maxValues.q1 * 100).toFixed(2) + '%' : '0%',
            maxValues.q2 > 0 ? ((counts.q2 || 0) / maxValues.q2 * 100).toFixed(2) + '%' : '0%',
            maxValues.q3 > 0 ? ((counts.q3 || 0) / maxValues.q3 * 100).toFixed(2) + '%' : '0%',
            maxValues.q4 > 0 ? ((counts.q4 || 0) / maxValues.q4 * 100).toFixed(2) + '%' : '0%'
          ]);
        });
        const ws4 = XLSX.utils.aoa_to_sheet(chartData);
        XLSX.utils.book_append_sheet(wb, ws4, 'Quadrant Distribution Charts');
        
        // Sheet 5: Total Assessments per HR Item
        const totalData = [];
        const headers5 = [
          'HR Item',
          'Total Assessments',
          'Q1 Count',
          'Q2 Count',
          'Q3 Count',
          'Q4 Count',
          'Q1 Percentage of Total',
          'Q2 Percentage of Total',
          'Q3 Percentage of Total',
          'Q4 Percentage of Total'
        ];
        totalData.push(headers5);
        allHRItems.forEach(hrCode => {
          const counts = this.combinedQuadrantData[hrCode] || { q1: 0, q2: 0, q3: 0, q4: 0 };
          const total = this.getCombinedTotalAssessments(hrCode);
          
          totalData.push([
            hrCode,
            total,
            counts.q1 || 0,
            counts.q2 || 0,
            counts.q3 || 0,
            counts.q4 || 0,
            total > 0 ? ((counts.q1 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q2 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q3 || 0) / total * 100).toFixed(2) + '%' : '0%',
            total > 0 ? ((counts.q4 || 0) / total * 100).toFixed(2) + '%' : '0%'
          ]);
        });
        const ws5 = XLSX.utils.aoa_to_sheet(totalData);
        XLSX.utils.book_append_sheet(wb, ws5, 'Total Assessments per HR Item');
        
        // Sheet 6: Summary
        const summaryData = [];
        const headers6 = ['Summary Metric', 'Value', 'Details'];
        summaryData.push(headers6);
        summaryData.push(['Total HR Items Assessed', allHRItems.length, 'Number of unique HR items']);
        summaryData.push(['Total Assessments', this.getOverallTotalAssessments(), 'Sum of all quadrant assessments']);
        summaryData.push(['Total Management Assessments', this.getTotalSourceCount('management'), 'From Management Assessment survey']);
        summaryData.push(['Total HR Self-Assessments', this.getTotalSourceCount('hr'), 'From HR Self-Assessment survey']);
        summaryData.push(['Total User Surveys', this.getTotalSourceCount('survey'), 'From User Survey']);
        quadrants.forEach(quadrant => {
          const data = quadrantSourceData[quadrant];
          summaryData.push([
            this.getQuadrantDisplayName(quadrant),
            data.total || 0,
            this.getQuadrantDescription(quadrant)
          ]);
        });
        summaryData.push(['', '', '']);
        summaryData.push(['TOP ITEMS PER QUADRANT', '', '']);
        quadrants.forEach(quadrant => {
          const items = this.getCombinedQuadrantItems(quadrant);
          if (items.length > 0) {
            summaryData.push([
              this.getQuadrantDisplayName(quadrant),
              items.length + ' items',
              'Items: ' + items.join(', ')
            ]);
          }
        });
        const ws6 = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws6, 'Summary');
        
        const fileName = `Quadrant_Analysis_Full_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        alert('Complete quadrant analysis exported successfully!');
        
      } catch (error) {
        console.error('Error exporting quadrant analysis:', error);
        alert('Error exporting quadrant analysis: ' + error.message);
      }
    },

    // Helper method to get actual HR code based on survey type
    getActualHRCode(surveyType, section, index) {
      if (surveyType === 'survey') {
        const surveyTab = this.tabs.find(t => t.key === 'survey');
        if (surveyTab?.hrMappings?.[section]?.[index] !== undefined) {
          return surveyTab.hrMappings[section][index];
        }
      }
      const sectionNum = section.replace('hr', '');
      return `HR${sectionNum}.${index + 1}`;
    },

    // Main quadrant calculation method
    calculateQuadrantData(responses) {
      const quadrantItems = {};
      
      if (!responses || responses.length === 0) {
        return quadrantItems;
      }
      
      responses.forEach(response => {
        const surveyType = response.surveyType || 
          (response.managerName && !response.assessorName && !response.name ? 'management' :
           response.assessorName && !response.managerName && !response.name ? 'hr' :
           response.name && !response.managerName && !response.assessorName ? 'survey' : 'unknown');
        
        ['hr1', 'hr2', 'hr3', 'hr4', 'hr5', 'hr6'].forEach(section => {
          const sectionData = response[section];
          if (sectionData && Array.isArray(sectionData)) {
            sectionData.forEach((item, index) => {
              if (!item) return;
              
              const hrCode = this.getActualHRCode(surveyType, section, index);
              
              if (!quadrantItems[hrCode]) {
                quadrantItems[hrCode] = { q1: 0, q2: 0, q3: 0, q4: 0 };
              }
              
              const importance = item.importance;
              const implementation = item.implementation;
              
              if (importance && implementation && 
                  importance !== 'NA' && implementation !== 'NA') {
                
                const impNum = parseInt(importance);
                const implNum = parseInt(implementation);
                
                if (isNaN(impNum) || isNaN(implNum)) return;
                
                if ((impNum === 3 || impNum === 4) && (implNum === 1 || implNum === 2)) {
                  quadrantItems[hrCode].q1++;
                } else if ((impNum === 3 || impNum === 4) && (implNum === 3 || implNum === 4)) {
                  quadrantItems[hrCode].q2++;
                } else if ((impNum === 1 || impNum === 2) && (implNum === 1 || implNum === 2)) {
                  quadrantItems[hrCode].q3++;
                } else if ((impNum === 1 || impNum === 2) && (implNum === 3 || implNum === 4)) {
                  quadrantItems[hrCode].q4++;
                }
              }
            });
          }
        });
      });
      
      return quadrantItems;
    },

    // Get final quadrant for an HR item
    getFinalQuadrant(hrCode) {
      const counts = this.quadrantData[hrCode];
      if (!counts) return null;
      
      const maxCount = Math.max(counts.q1, counts.q2, counts.q3, counts.q4);
      if (maxCount === 0) return null;
      
      if (counts.q1 === maxCount) return 'q1';
      if (counts.q2 === maxCount) return 'q2';
      if (counts.q3 === maxCount) return 'q3';
      return 'q4';
    },

    getCombinedFinalQuadrant(hrCode) {
      const counts = this.combinedQuadrantData[hrCode];
      if (!counts) return null;
      
      const maxCount = Math.max(counts.q1, counts.q2, counts.q3, counts.q4);
      if (maxCount === 0) return null;
      
      if (counts.q1 === maxCount) return 'q1';
      if (counts.q2 === maxCount) return 'q2';
      if (counts.q3 === maxCount) return 'q3';
      return 'q4';
    },

    getQuadrantItems(quadrant) {
      const items = [];
      for (const hrCode in this.quadrantData) {
        if (this.getFinalQuadrant(hrCode) === quadrant) {
          items.push(hrCode);
        }
      }
      return items.sort();
    },

    getCombinedQuadrantItems(quadrant) {
      const items = [];
      for (const hrCode in this.combinedQuadrantData) {
        if (this.getCombinedFinalQuadrant(hrCode) === quadrant) {
          items.push(hrCode);
        }
      }
      return items.sort();
    },

    getItemCount(hrCode) {
      const counts = this.quadrantData[hrCode];
      if (!counts) return 0;
      return counts.q1 + counts.q2 + counts.q3 + counts.q4;
    },

    getCombinedItemCount(hrCode) {
      const counts = this.combinedQuadrantData[hrCode];
      if (!counts) return 0;
      return counts.q1 + counts.q2 + counts.q3 + counts.q4;
    },

    getAllHRItems() {
      return Object.keys(this.quadrantData).sort();
    },

    getAllCombinedHRItems() {
      return Object.keys(this.combinedQuadrantData).sort();
    },

    getTotalAssessments(hrCode) {
      const counts = this.quadrantData[hrCode];
      if (!counts) return 0;
      return counts.q1 + counts.q2 + counts.q3 + counts.q4;
    },

    getCombinedTotalAssessments(hrCode) {
      const counts = this.combinedQuadrantData[hrCode];
      if (!counts) return 0;
      return counts.q1 + counts.q2 + counts.q3 + counts.q4;
    },

    // Chart helper methods
    getChartPercentage(value, maxValue) {
      if (!maxValue || maxValue === 0) return 0;
      return (value / maxValue) * 100;
    },

    getMaxQ1Value() {
      let max = 0;
      for (const hrCode in this.combinedQuadrantData) {
        const value = this.combinedQuadrantData[hrCode]?.q1 || 0;
        if (value > max) max = value;
      }
      return max;
    },

    getMaxQ2Value() {
      let max = 0;
      for (const hrCode in this.combinedQuadrantData) {
        const value = this.combinedQuadrantData[hrCode]?.q2 || 0;
        if (value > max) max = value;
      }
      return max;
    },

    getMaxQ3Value() {
      let max = 0;
      for (const hrCode in this.combinedQuadrantData) {
        const value = this.combinedQuadrantData[hrCode]?.q3 || 0;
        if (value > max) max = value;
      }
      return max;
    },

    getMaxQ4Value() {
      let max = 0;
      for (const hrCode in this.combinedQuadrantData) {
        const value = this.combinedQuadrantData[hrCode]?.q4 || 0;
        if (value > max) max = value;
      }
      return max;
    },

    getMaxTotalValue() {
      let max = 0;
      for (const hrCode in this.combinedQuadrantData) {
        const value = this.getCombinedTotalAssessments(hrCode);
        if (value > max) max = value;
      }
      return max;
    },

    // Quadrant chart data helpers
    getQuadrantChartData(hrCode, quadrantData) {
      const counts = quadrantData[hrCode];
      if (!counts) return { q1: 0, q2: 0, q3: 0, q4: 0, total: 0 };
      
      return {
        q1: counts.q1 || 0,
        q2: counts.q2 || 0,
        q3: counts.q3 || 0,
        q4: counts.q4 || 0,
        total: (counts.q1 || 0) + (counts.q2 || 0) + (counts.q3 || 0) + (counts.q4 || 0)
      };
    },

    getQuadrantChartPercentage(value, total) {
      if (!total || total === 0) return 0;
      return (value / total) * 100;
    },

    // Quadrant source data
    calculateQuadrantSourceData() {
      const quadrantSourceData = {
        q1: { management: 0, hr: 0, survey: 0, total: 0 },
        q2: { management: 0, hr: 0, survey: 0, total: 0 },
        q3: { management: 0, hr: 0, survey: 0, total: 0 },
        q4: { management: 0, hr: 0, survey: 0, total: 0 }
      };
      
      if (!this.allResponses || this.allResponses.length === 0) {
        return quadrantSourceData;
      }
      
      this.allResponses.forEach(response => {
        const surveyType = response.surveyType || 
          (response.managerName && !response.assessorName && !response.name ? 'management' :
           response.assessorName && !response.managerName && !response.name ? 'hr' :
           response.name && !response.managerName && !response.assessorName ? 'survey' : 'unknown');
        
        ['hr1', 'hr2', 'hr3', 'hr4', 'hr5', 'hr6'].forEach(section => {
          const sectionData = response[section];
          if (sectionData && Array.isArray(sectionData)) {
            sectionData.forEach((item, index) => {
              if (!item) return;
              
              const importance = item.importance;
              const implementation = item.implementation;
              
              if (importance && implementation && 
                  importance !== 'NA' && implementation !== 'NA') {
                
                const impNum = parseInt(importance);
                const implNum = parseInt(implementation);
                
                if (isNaN(impNum) || isNaN(implNum)) return;
                
                let quadrant = null;
                if ((impNum === 3 || impNum === 4) && (implNum === 1 || implNum === 2)) {
                  quadrant = 'q1';
                } else if ((impNum === 3 || impNum === 4) && (implNum === 3 || implNum === 4)) {
                  quadrant = 'q2';
                } else if ((impNum === 1 || impNum === 2) && (implNum === 1 || implNum === 2)) {
                  quadrant = 'q3';
                } else if ((impNum === 1 || impNum === 2) && (implNum === 3 || implNum === 4)) {
                  quadrant = 'q4';
                }
                
                if (quadrant && surveyType && quadrantSourceData[quadrant]) {
                  quadrantSourceData[quadrant][surveyType]++;
                  quadrantSourceData[quadrant].total++;
                }
              }
            });
          }
        });
      });
      
      return quadrantSourceData;
    },

    getQuadrantDisplayName(quadrant) {
      const names = {
        q1: 'Q1: Fix & Improve',
        q2: 'Q2: Maintain & Sustain',
        q3: 'Q3: Leave Alone',
        q4: 'Q4: Review to Maintain or Abolish'
      };
      return names[quadrant] || quadrant;
    },

    getQuadrantDescription(quadrant) {
      const descs = {
        q1: 'High Importance, Low Implementation',
        q2: 'High Importance, High Implementation',
        q3: 'Low Importance, Low Implementation',
        q4: 'Low Importance, High Implementation'
      };
      return descs[quadrant] || '';
    },

    getQuadrantSourceCount(quadrant, surveyType) {
      const sourceData = this.calculateQuadrantSourceData();
      return sourceData[quadrant]?.[surveyType] || 0;
    },

    getQuadrantTotalAssessments(quadrant) {
      const sourceData = this.calculateQuadrantSourceData();
      return sourceData[quadrant]?.total || 0;
    },

    getQuadrantSourcePercentage(quadrant, surveyType) {
      const sourceData = this.calculateQuadrantSourceData();
      const quadrantData = sourceData[quadrant];
      if (!quadrantData || quadrantData.total === 0) return 0;
      
      const count = quadrantData[surveyType] || 0;
      return Math.round((count / quadrantData.total) * 100);
    },

    getQuadrantPercentageStyle(quadrant, surveyType) {
      const percentage = this.getQuadrantSourcePercentage(quadrant, surveyType);
      return {
        '--percent': `${percentage}%`
      };
    },

    getTotalSourceCount(surveyType) {
      const sourceData = this.calculateQuadrantSourceData();
      let total = 0;
      for (const quadrant in sourceData) {
        total += sourceData[quadrant][surveyType] || 0;
      }
      return total;
    },

    getOverallTotalAssessments() {
      const sourceData = this.calculateQuadrantSourceData();
      let total = 0;
      for (const quadrant in sourceData) {
        total += sourceData[quadrant].total || 0;
      }
      return total;
    },

    // Basic methods
    setTab(key) {
      this.activeTab = key;
      this.activeStatsSection = "hr1";
      this.selectedResponse = null;
      if (key === 'quadrant') {
        this.fetchAllResponses();
      } else {
        this.fetchResponses();
      }
    },

    async fetchResponses() {
      this.fetchError = null;
      try {
        const tab = this.tabs.find(t => t.key === this.activeTab);
        const res = await axios.get(tab.url, { headers: { Authorization: `Bearer ${this.token}` } });
        this.responses = res.data.map(r => ({ ...r, surveyType: this.activeTab }));
      } catch (err) {
        console.error("Error fetching responses:", err);
        this.handleFetchError(err);
      }
    },

    async fetchAllResponses() {
      this.fetchError = null;
      try {
        const [managementRes, hrRes, surveyRes] = await Promise.all([
          axios.get("/api/management", { headers: { Authorization: `Bearer ${this.token}` } }),
          axios.get("/api/hr-self-assessment", { headers: { Authorization: `Bearer ${this.token}` } }),
          axios.get("/api/user-survey", { headers: { Authorization: `Bearer ${this.token}` } })
        ]);
        
        const managementWithType = managementRes.data.map(r => ({ ...r, surveyType: 'management' }));
        const hrWithType = hrRes.data.map(r => ({ ...r, surveyType: 'hr' }));
        const surveyWithType = surveyRes.data.map(r => ({ ...r, surveyType: 'survey' }));
        
        this.allResponses = [
          ...managementWithType,
          ...hrWithType,
          ...surveyWithType
        ];
        this.responses = this.allResponses;
      } catch (err) {
        console.error("Error fetching all responses:", err);
        this.handleFetchError(err);
      }
    },

    handleFetchError(err) {
      if (err.response) {
        this.fetchError = `Error ${err.response.status}: ${err.response.data.message || err.response.data.error || "Unknown error"}`;
        if (err.response.status === 401) {
          localStorage.removeItem("token");
          this.$router.push("/admin-login");
        }
      } else {
        this.fetchError = `Network or server error: ${err.message}`;
      }
    },

    selectResponse(resp) {
      this.selectedResponse = resp;
    },

    async deleteResponse(id) {
      if (!confirm("Are you sure you want to delete this response?")) return;
      try {
        const tab = this.tabs.find(t => t.key === this.activeTab);
        const url = `${tab.url}?id=${id}`;
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
      return r.name || r.managerName || r.assessorName || "Anonymous";
    },

    getAssessmentDate(r) {
      if (!r) return null;
      if (r.assessmentDate) return new Date(r.assessmentDate).toLocaleDateString();
      if (r.submissionDate) return new Date(r.submissionDate).toLocaleDateString();
      if (r.createdAt) return new Date(r.createdAt).toLocaleDateString();
      return null;
    },

    getSectionLength(section) {
      if (this.activeTab === 'survey') {
        const sectionLengths = {
          hr1: 4,
          hr2: 2,
          hr3: 8,
          hr4: 6,
          hr5: 3,
          hr6: 4
        };
        return sectionLengths[section] || 0;
      } else {
        const sectionLengths = {
          hr1: 6,
          hr2: 2,
          hr3: 10,
          hr4: 6,
          hr5: 4,
          hr6: 6
        };
        return sectionLengths[section] || 0;
      }
    },

    getRatingClass(value) {
      if (value === 'NA' || !value) return 'rating-na';
      const num = parseInt(value);
      if (num >= 4) return 'rating-high';
      if (num >= 3) return 'rating-medium';
      if (num >= 2) return 'rating-low';
      return 'rating-very-low';
    },

    // Statistics methods (simplified versions)
    getCurrentSectionQuestions() {
      const sectionIndex = this.currentSections.indexOf(this.activeStatsSection);
      if (sectionIndex === -1) return [];
      
      let startIndex = 0;
      for (let i = 0; i < sectionIndex; i++) {
        startIndex += this.getSectionLength(this.currentSections[i]);
      }
      
      const sectionLength = this.getSectionLength(this.activeStatsSection);
      return this.currentQuestions.slice(startIndex, startIndex + sectionLength).map(q => q.text);
    },

    getRatingCount(type, rating, questionIndex = null) {
      let total = 0;
      const ratingStr = rating.toString();
      
      this.responses.forEach(response => {
        const sectionData = response[this.activeStatsSection];
        if (!sectionData) return;
        
        if (questionIndex !== null) {
          const item = sectionData[questionIndex];
          if (item && item[type] === ratingStr) {
            total++;
          }
        } else {
          sectionData.forEach(item => {
            if (item && item[type] === ratingStr) {
              total++;
            }
          });
        }
      });
      
      return total;
    },

    getTotalCount(type, questionIndex = null) {
      if (questionIndex !== null) {
        return this.responses.filter(response => {
          const sectionData = response[this.activeStatsSection];
          return sectionData && sectionData[questionIndex] && sectionData[questionIndex][type];
        }).length;
      } else {
        let total = 0;
        this.responses.forEach(response => {
          const sectionData = response[this.activeStatsSection];
          if (sectionData) {
            sectionData.forEach(item => {
              if (item && item[type]) {
                total++;
              }
            });
          }
        });
        return total;
      }
    },

    getPercentage(type, rating, questionIndex = null) {
      const count = this.getRatingCount(type, rating, questionIndex);
      const total = questionIndex !== null ? 
        this.getTotalCount(type, questionIndex) : 
        this.getTotalCount(type);
      
      if (total === 0) return 0;
      return Math.round((count / total) * 100);
    },

    getStatsCellClass(type, rating, questionIndex) {
      const percentage = this.getPercentage(type, rating, questionIndex);
      if (percentage >= 50) return 'stats-high';
      if (percentage >= 30) return 'stats-medium';
      if (percentage >= 10) return 'stats-low';
      return 'stats-very-low';
    },

    getAverageRating(type) {
      let totalScore = 0;
      let totalCount = 0;
      
      this.responses.forEach(response => {
        this.currentSections.forEach(section => {
          const sectionData = response[section];
          if (sectionData) {
            sectionData.forEach(item => {
              if (item && item[type] && item[type] !== 'NA') {
                totalScore += parseInt(item[type]);
                totalCount++;
              }
            });
          }
        });
      });
      
      return totalCount > 0 ? totalScore / totalCount : 0;
    },

    getCompletionRate() {
      let totalQuestions = 0;
      let answeredQuestions = 0;
      
      this.responses.forEach(response => {
        this.currentSections.forEach(section => {
          const sectionData = response[section];
          if (sectionData) {
            totalQuestions += sectionData.length;
            sectionData.forEach(item => {
              if (item && (item.importance || item.implementation)) {
                answeredQuestions++;
              }
            });
          }
        });
      });
      
      return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    },

    getChartHeight(type, rating) {
      const totalResponses = this.getTotalCount(type);
      if (totalResponses === 0) return 0;
      
      const count = this.getRatingCount(type, rating);
      return (count / totalResponses) * 100;
    },

    exportToCSV() {
      const headers = [];
      
      headers.push('Name');
      if (this.showPositionColumn) headers.push('Position');
      if (this.showDepartmentColumn) headers.push('Department');
      if (this.showDateJoinedColumn) headers.push('Date Joined');
      headers.push('Assessment Date');
      
      this.currentQuestions.forEach((question, index) => {
        headers.push(`${question.text} - Importance`);
        headers.push(`${question.text} - Implementation`);
      });
      
      if (this.showObstaclesColumn) headers.push('Obstacles');
      if (this.showSuggestionsColumn) headers.push('Suggestions');
      if (this.showStrengthsColumn) headers.push('Strengths & Weaknesses');
      
      const csvData = [headers];
      
      this.responses.forEach(response => {
        const row = [];
        
        row.push(this.displayName(response));
        if (this.showPositionColumn) row.push(response.position || '');
        if (this.showDepartmentColumn) row.push(response.department || '');
        if (this.showDateJoinedColumn) row.push(response.dateJoined || '');
        row.push(this.getAssessmentDate(response));
        
        this.currentSections.forEach(section => {
          const sectionData = response[section] || [];
          if (sectionData.length > 0) {
            sectionData.forEach(item => {
              row.push(item.importance || 'NA');
              row.push(item.implementation || 'NA');
            });
          } else {
            for (let i = 0; i < this.getSectionLength(section); i++) {
              row.push('NA', 'NA');
            }
          }
        });
        
        if (this.showObstaclesColumn) row.push(response.obstacles || '');
        if (this.showSuggestionsColumn) row.push(response.suggestions || '');
        if (this.showStrengthsColumn) row.push(response.strengthsWeaknesses || '');
        
        csvData.push(row);
      });
      
      const csvContent = csvData.map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.currentTabLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  
  mounted() {
    if (this.token) this.fetchResponses();
  }
};
</script>

<style scoped>
/* Add export grid styles */
.export-grid {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.export-grid .export-section {
  margin-bottom: 10px;
}

.export-grid .export-section:last-child {
  margin-bottom: 0;
}

/* Updated export button styles */
.export-btn {
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  margin-right: 8px;
  margin-bottom: 8px;
  display: inline-block;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.export-btn:active {
  transform: translateY(0);
}

/* Button color variants */
.export-btn.bg-purple-600 {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
}

.export-btn.bg-purple-600:hover {
  background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
}

.export-btn.bg-indigo-600 {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
}

.export-btn.bg-indigo-600:hover {
  background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
}

.export-btn.bg-blue-600 {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.export-btn.bg-blue-600:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
}

.export-btn.bg-green-600 {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.export-btn.bg-green-600:hover {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
}

.export-btn.bg-orange-600 {
  background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
}

.export-btn.bg-orange-600:hover {
  background: linear-gradient(135deg, #c2410c 0%, #9a3412 100%);
}

.export-btn.bg-red-600 {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.export-btn.bg-red-600:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
}

/* Ensure buttons don't overflow on mobile */
@media (max-width: 768px) {
  .export-grid .export-section {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .export-btn {
    margin-right: 0;
    flex: 1;
    min-width: 120px;
    text-align: center;
    font-size: 0.875rem;
    padding: 8px 12px;
  }
}

/* Rest of your existing CSS styles remain the same */
.dashboard-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
  flex-wrap: wrap;
}

.tabs button {
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.tabs button:hover:not(.active) {
  background: #f3f4f6;
}

.hr-item-submissions-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 25px;
  margin-top: 30px;
}

.submissions-table {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
}

.submissions-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.submissions-table th,
.submissions-table td {
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  text-align: center;
}

.submissions-table th {
  background: #1e40af;
  color: white;
  font-weight: 600;
  position: sticky;
  top: 0;
}

.submissions-table th:first-child {
  text-align: left;
}

.submissions-table td:first-child {
  text-align: left;
  font-weight: 500;
}

.submissions-table tr:nth-child(even) {
  background: #f9fafb;
}

.submissions-table tr:hover {
  background: #f0f9ff;
}

/* Color coding for percentages */
.submissions-table td:nth-child(2) { /* Management */
  background: linear-gradient(to right, #f0f9ff 0%, #f0f9ff var(--percent), white var(--percent), white 100%);
  position: relative;
}

.submissions-table td:nth-child(3) { /* HR Self-Assessment */
  background: linear-gradient(to right, #f0fdf4 0%, #f0fdf4 var(--percent), white var(--percent), white 100%);
  position: relative;
}

.submissions-table td:nth-child(4) { /* User Survey */
  background: linear-gradient(to right, #faf5ff 0%, #faf5ff var(--percent), white var(--percent), white 100%);
  position: relative;
}

/* Add percentage indicator inside cells */
.submissions-table td::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--percent);
  z-index: -1;
  opacity: 0.1;
}

.submissions-table td:nth-child(2)::before {
  background-color: #0ea5e9;
}

.submissions-table td:nth-child(3)::before {
  background-color: #10b981;
}

.submissions-table td:nth-child(4)::before {
  background-color: #8b5cf6;
}

.submissions-table td {
  position: relative;
  z-index: 1;
}

.data-section {
  margin-top: 20px;
}

.refresh-btn {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.response-list {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.response-item {
  padding: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
  border-radius: 6px;
  background: white;
  transition: background 0.2s;
}

.response-item:hover {
  background: #f9fafb;
}

.response-details {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border-left: 4px solid #3b82f6;
}

.basic-info {
  background: #f8fafc;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.basic-info p {
  margin: 5px 0;
}

.rating-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.rating-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
}

.rating-item {
  padding: 8px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #3b82f6;
}

.no-response {
  color: #6b7280;
  font-style: italic;
}

.open-feedback {
  background: #f0f9ff;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #0ea5e9;
}

.open-feedback p {
  margin: 8px 0;
  line-height: 1.5;
}

/* Spreadsheet Styles */
.spreadsheet-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.table-container {
  overflow-x: auto;
  max-width: 100%;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  min-width: 1200px;
}

.summary-table th,
.summary-table td {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  text-align: left;
  vertical-align: top;
}

.summary-table th {
  background: #f8fafc;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.summary-table thead tr:first-child th {
  background: #1e40af;
  color: white;
  text-align: center;
}

.summary-table thead tr:last-child th {
  background: #3b82f6;
  color: white;
  font-weight: 500;
}

.question-header {
  font-size: 0.8rem;
  line-height: 1.2;
}

.sub-header {
  font-size: 0.75rem;
  text-align: center !important;
}

.data-row:hover {
  background: #f0f9ff;
}

/* Rating color coding */
.rating-high {
  background: #dcfce7;
  color: #166534;
  font-weight: bold;
  text-align: center;
}

.rating-medium {
  background: #fef9c3;
  color: #854d0e;
  text-align: center;
}

.rating-low {
  background: #fed7aa;
  color: #9a3412;
  text-align: center;
}

.rating-very-low {
  background: #fecaca;
  color: #991b1b;
  text-align: center;
}

.rating-na {
  background: #f3f4f6;
  color: #6b7280;
  text-align: center;
  font-style: italic;
}

.open-ended-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.open-ended-cell:hover {
  white-space: normal;
  overflow: visible;
  background: #fefce8;
  z-index: 20;
  position: relative;
}

.export-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.export-btn {
  padding: 10px 20px;
  background: #059669;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.export-btn:hover {
  background: #047857;
}

/* Statistics Styles */
.statistics-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.stats-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
  flex-wrap: wrap;
}

.stats-tabs button {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.875rem;
}

.stats-tabs button.active {
  background: #1e40af;
  color: white;
  border-color: #1e40af;
}

.stats-tabs button:hover:not(.active) {
  background: #f3f4f6;
}

.stats-table-container {
  overflow-x: auto;
  max-width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  min-width: 900px;
}

.stats-table th,
.stats-table td {
  border: 1px solid #e5e7eb;
  padding: 8px 6px;
  text-align: center;
  vertical-align: middle;
}

.stats-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
}

.rating-header {
  background: #1e40af !important;
  color: white !important;
  font-weight: bold !important;
}

.importance-header {
  background: #1e40af !important;
}

.implementation-header {
  background: #059669 !important;
}

.total-header {
  background: #059669 !important;
  color: white !important;
  font-weight: bold !important;
}

.count-header {
  background: #3b82f6 !important;
  color: white !important;
  font-weight: 500 !important;
  font-size: 0.75rem;
}

.question-col {
  text-align: left !important;
  background: #f8fafc;
  min-width: 250px;
  max-width: 300px;
  font-weight: 600;
}

.question-text {
  text-align: left !important;
  font-size: 0.75rem;
  line-height: 1.3;
  padding: 8px 12px;
}

.count-cell {
  position: relative;
  font-weight: 500;
  min-width: 60px;
}

.percentage {
  font-size: 0.7rem;
  color: #6b7280;
  display: block;
  margin-top: 2px;
}

.total-cell {
  background: #dcfce7 !important;
  color: #166534 !important;
  font-weight: bold !important;
  font-size: 0.9rem;
}

/* Statistics cell colors */
.stats-high {
  background: #dcfce7;
  color: #166534;
}

.stats-medium {
  background: #fef9c3;
  color: #854d0e;
}

.stats-low {
  background: #fed7aa;
  color: #9a3412;
}

.stats-very-low {
  background: #fecaca;
  color: #991b1b;
}

.stats-row:hover {
  background: #f0f9ff;
}

/* Summary Statistics */
.summary-stats {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1e40af;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Distribution Charts */
.distribution-charts {
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.chart-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.chart-container h5 {
  text-align: center;
  margin-bottom: 20px;
  color: #374151;
  font-weight: 600;
}

.chart-bars {
  display: flex;
  align-items: flex-end; /* Change from 'end' to 'flex-end' */
  justify-content: space-between;
  height: 200px;
  gap: 15px;
  padding: 0 10px;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.chart-label {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.chart-bar-wrapper {
  height: 150px;
  width: 100%;
  display: flex;
  align-items: flex-end; /* Ensure this is also flex-end */
  position: relative;
  background: #f8fafc;
  border-radius: 4px;
}

.chart-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  min-height: 20px;
  display: flex;
  align-self: flex-end; /* Add this line */
  align-items: flex-start; /* Change from 'end' to 'flex-start' */
  justify-content: center;
}

.importance-bar {
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.implementation-bar {
  background: linear-gradient(to top, #10b981, #34d399);
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.chart-count {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

/* Quadrant Section Styles - COMPLETELY SEPARATED */
.quadrant-section, .quadrant-analysis-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 25px;
  margin-top: 30px;
}

/* Quadrant Cards Container - SEPARATE from table */
.quadrant-cards-container {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

/* Matrix Grid - Fixed layout */
.matrix-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  min-height: 350px;
  margin-bottom: 20px;
}

/* Quadrant Cards */
.quadrant-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  z-index: 1;
}

.quadrant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quadrant-header {
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.quadrant-header h4 {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  color: #1f2937;
}

.quadrant-desc {
  font-size: 0.85rem;
  color: #6b7280;
  font-style: italic;
}

.quadrant-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 250px;
}

.hr-item {
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.hr-item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.item-count {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: normal;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

.no-items {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 30px 20px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px dashed #d1d5db;
}

/* Quadrant-specific styles */
.quadrant-1 {
  border-color: #dc2626;
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
}

.quadrant-1 .quadrant-header h4 {
  color: #dc2626;
}

.quadrant-2 {
  border-color: #059669;
  background: linear-gradient(135deg, #f0fdf4 0%, #a7f3d0 100%);
}

.quadrant-2 .quadrant-header h4 {
  color: #059669;
}

.quadrant-3 {
  border-color: #d97706;
  background: linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%);
}

.quadrant-3 .quadrant-header h4 {
  color: #d97706;
}

.quadrant-4 {
  border-color: #7c3aed;
  background: linear-gradient(135deg, #faf5ff 0%, #ddd6fe 100%);
}

.quadrant-4 .quadrant-header h4 {
  color: #7c3aed;
}

/* Quadrant Legend */
.quadrant-legend {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  position: relative;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.legend-axis {
  display: flex;
  justify-content: space-between;
  width: 48%;
  font-size: 0.8rem;
  color: #6b7280;
}

.legend-axis.vertical {
  position: absolute;
  right: 0;
  top: -30px;
  width: 200px;
  transform: rotate(-90deg);
  transform-origin: right top;
}

.axis-label {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.axis-label.high {
  color: #059669;
  background: #f0fdf4;
  border-color: #a7f3d0;
}

.axis-label.low {
  color: #dc2626;
  background: #fef2f2;
  border-color: #fecaca;
}

/* Breakdown Container - COMPLETELY SEPARATE from cards */
.breakdown-container {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 25px;
  margin-top: 20px;
  position: relative;
  z-index: 2;
}

.breakdown-container h4 {
  margin-bottom: 15px;
  color: #374151;
}

.breakdown-table {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  position: relative;
  z-index: 2;
}

.breakdown-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  position: relative;
  z-index: 2;
}

.breakdown-table th,
.breakdown-table td {
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  text-align: left;
  position: relative;
  z-index: 2;
}

.breakdown-table th {
  background: #1e40af;
  color: white;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.breakdown-table tr:nth-child(even) {
  background: #f9fafb;
}

.breakdown-table tr:hover {
  background: #f0f9ff;
}

/* Quadrant cell colors for table */
.quadrant-q1 {
  background: #fef2f2 !important;
  color: #dc2626;
  font-weight: 600;
  border-left: 4px solid #dc2626;
}

.quadrant-q2 {
  background: #f0fdf4 !important;
  color: #059669;
  font-weight: 600;
  border-left: 4px solid #059669;
}

.quadrant-q3 {
  background: #fffbeb !important;
  color: #d97706;
  font-weight: 600;
  border-left: 4px solid #d97706;
}

.quadrant-q4 {
  background: #faf5ff !important;
  color: #7c3aed;
  font-weight: 600;
  border-left: 4px solid #7c3aed;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .matrix-grid {
    min-height: 300px;
    gap: 15px;
  }
  
  .quadrant-header h4 {
    font-size: 1rem;
  }
  
  .hr-item {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
  
  .quadrant-cards-container,
  .breakdown-container {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .matrix-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    gap: 12px;
    min-height: auto;
  }
  
  .legend-axis.vertical {
    display: none;
  }
  
  .breakdown-table {
    font-size: 0.8rem;
  }
  
  .breakdown-table th,
  .breakdown-table td {
    padding: 8px 10px;
  }
  
  .quadrant-section, .quadrant-analysis-section {
    padding: 15px;
  }
}

@media (max-width: 640px) {
  .quadrant-card {
    padding: 12px;
  }
  
  .quadrant-content {
    max-height: 200px;
  }
  
  .quadrant-cards-container,
  .breakdown-container {
    padding: 12px;
  }
}

/* Ensure no overlap with proper z-index stacking */
.quadrant-cards-container {
  position: relative;
  z-index: 1;
}

.breakdown-container {
  position: relative;
  z-index: 2;
}

/* Clear separation between sections */
.quadrant-section > *,
.quadrant-analysis-section > * {
  position: relative;
  z-index: auto;
}

/* Quadrant Item Chart Styles */
.quadrant-item-chart {
  margin-top: 8px;
  width: 100%;
}

.chart-bars.small {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 60px;
  gap: 4px;
  padding: 0 5px;
  background: #f8fafc;
  border-radius: 4px;
}

.chart-bar-container.small {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.chart-bar-wrapper.small {
  height: 40px;
  width: 100%;
  display: flex;
  align-items: end;
  position: relative;
  background: #f1f5f9;
  border-radius: 2px;
}

.chart-bar.quadrant-bar {
  width: 100%;
  border-radius: 2px 2px 0 0;
  transition: all 0.3s ease;
  position: relative;
  min-height: 4px;
  display: flex;
  align-items: end;
  justify-content: center;
}

/* Quadrant-specific bar colors */
.chart-bar.quadrant-bar.quadrant-1 {
  background: linear-gradient(to top, #dc2626, #ef4444);
  box-shadow: 0 1px 2px rgba(220, 38, 38, 0.3);
}

.chart-bar.quadrant-bar.quadrant-2 {
  background: linear-gradient(to top, #059669, #10b981);
  box-shadow: 0 1px 2px rgba(5, 150, 105, 0.3);
}

.chart-bar.quadrant-bar.quadrant-3 {
  background: linear-gradient(to top, #d97706, #f59e0b);
  box-shadow: 0 1px 2px rgba(217, 119, 6, 0.3);
}

.chart-bar.quadrant-bar.quadrant-4 {
  background: linear-gradient(to top, #7c3aed, #8b5cf6);
  box-shadow: 0 1px 2px rgba(124, 58, 237, 0.3);
}

.chart-count.small {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  background: white;
  padding: 1px 4px;
  border-radius: 2px;
  border: 1px solid #e5e7eb;
  z-index: 1;
}

.chart-label {
  font-size: 0.6rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #374151;
  text-align: center;
}

/* Adjust HR item to accommodate chart */
.hr-item {
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.hr-item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.item-count {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: normal;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
  margin-bottom: 8px;
}

/* Make sure chart bars are visible even with low counts */
.chart-bar-wrapper.small {
  min-height: 40px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chart-bars.small {
    height: 50px;
    gap: 3px;
  }
  
  .chart-bar-wrapper.small {
    height: 30px;
  }
  
  .chart-count.small {
    font-size: 0.55rem;
    top: -16px;
  }
  
  .chart-label {
    font-size: 0.55rem;
  }
}

/* Add these styles to your existing styles */

/* Charts Section */
.charts-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 25px;
  margin-top: 30px;
}

.charts-section h4 {
  margin-bottom: 10px;
  color: #374151;
  font-size: 1.25rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-top: 20px;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-card h5 {
  margin: 0 0 5px 0;
  color: #1f2937;
  font-size: 1rem;
}

.chart-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 15px;
  font-style: italic;
}

.chart-container {
  display: flex;
  flex: 1;
  min-height: 300px;
  max-height: 350px;
  overflow: hidden;
}

.chart-card.full-width .chart-container {
  min-height: 400px;
  max-height: 450px;
}

.chart-y-axis {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #d1d5db;
  margin-right: 10px;
}

.chart-y-axis span {
  transform: rotate(-90deg);
  white-space: nowrap;
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.chart-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

.chart-bars.horizontal {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.chart-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1px 0;
}

.chart-bar-label {
  width: 60px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-align: right;
  flex-shrink: 0;
}

.chart-bar-bg {
  flex: 1;
  height: 24px;
  background: #f1f5f9;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  min-width: 30px;
}

.chart-bar-value {
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

/* Quadrant-specific bar colors */
.q1-bar {
  background: linear-gradient(90deg, #ef4444, #f87171);
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.2);
}

.q2-bar {
  background: linear-gradient(90deg, #10b981, #34d399);
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.2);
}

.q3-bar {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  box-shadow: 0 1px 3px rgba(245, 158, 11, 0.2);
}

.q4-bar {
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  box-shadow: 0 1px 3px rgba(139, 92, 246, 0.2);
}

.total-bar {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.2);
}

/* Scrollbar styling */
.chart-content::-webkit-scrollbar {
  width: 6px;
}

.chart-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.chart-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.chart-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Hover effects */
.chart-bar-wrapper:hover .chart-bar-label {
  color: #1e40af;
}

.chart-bar-wrapper:hover .chart-bar-bg {
  background: #e2e8f0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .charts-section {
    padding: 15px;
  }
  
  .chart-container {
    min-height: 250px;
    max-height: 300px;
  }
  
  .chart-card.full-width .chart-container {
    min-height: 350px;
    max-height: 400px;
  }
  
  .chart-bar-label {
    width: 50px;
    font-size: 0.7rem;
  }
  
  .chart-bar-value {
    font-size: 0.65rem;
    padding-right: 5px;
  }
}

@media (max-width: 640px) {
  .charts-grid {
    gap: 15px;
  }
  
  .chart-card {
    padding: 15px;
  }
  
  .chart-y-axis {
    width: 30px;
  }
  
  .chart-y-axis span {
    font-size: 0.7rem;
  }
  
  .chart-bar-bg {
    height: 20px;
  }
}

/* Add these styles to your existing CSS */
.quadrant-submissions-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 25px;
  margin-top: 30px;
}

.quadrant-submissions-section h4 {
  margin-bottom: 10px;
  color: #374151;
  font-size: 1.25rem;
}

.quadrant-submissions-section .submissions-table {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
}

.quadrant-submissions-section table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.quadrant-submissions-section th,
.quadrant-submissions-section td {
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  text-align: center;
}

.quadrant-submissions-section th {
  background: #1e40af;
  color: white;
  font-weight: 600;
  position: sticky;
  top: 0;
}

.quadrant-submissions-section th:first-child,
.quadrant-submissions-section td:first-child {
  text-align: left;
}

.quadrant-submissions-section th:nth-child(2),
.quadrant-submissions-section td:nth-child(2) {
  text-align: left;
}

.quadrant-desc-cell {
  font-size: 0.8rem;
  color: #6b7280;
  font-style: italic;
}

.quadrant-submissions-section tr:nth-child(even) {
  background: #f9fafb;
}

.quadrant-submissions-section tr:hover {
  background: #f0f9ff;
}

.quadrant-submissions-section .total-row {
  background: #1e40af;
  color: white;
  font-weight: bold;
}

.quadrant-submissions-section .total-row td {
  color: white;
  border-color: #1e3a8a;
}

.count-badge {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 5px;
}

.quadrant-submissions-section td:nth-child(3) { /* Management */
  background: linear-gradient(to right, #f0f9ff 0%, #f0f9ff var(--percent), white var(--percent), white 100%);
  position: relative;
}

.quadrant-submissions-section td:nth-child(4) { /* HR Self-Assessment */
  background: linear-gradient(to right, #f0fdf4 0%, #f0fdf4 var(--percent), white var(--percent), white 100%);
  position: relative;
}

.quadrant-submissions-section td:nth-child(5) { /* User Survey */
  background: linear-gradient(to right, #faf5ff 0%, #faf5ff var(--percent), white var(--percent), white 100%);
  position: relative;
}

.quadrant-submissions-section td::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--percent);
  z-index: -1;
  opacity: 0.1;
}

.quadrant-submissions-section td:nth-child(3)::before {
  background-color: #0ea5e9;
}

.quadrant-submissions-section td:nth-child(4)::before {
  background-color: #10b981;
}

.quadrant-submissions-section td:nth-child(5)::before {
  background-color: #8b5cf6;
}

.quadrant-submissions-section td {
  position: relative;
  z-index: 1;
}

/* Quadrant-specific row styling */
.quadrant-submissions-section tr:nth-child(1) { /* Q1 */
  border-left: 4px solid #dc2626;
}

.quadrant-submissions-section tr:nth-child(2) { /* Q2 */
  border-left: 4px solid #059669;
}

.quadrant-submissions-section tr:nth-child(3) { /* Q3 */
  border-left: 4px solid #d97706;
}

.quadrant-submissions-section tr:nth-child(4) { /* Q4 */
  border-left: 4px solid #7c3aed;
}

/* Updated export button styles for quadrant analysis */
.export-btn.bg-purple-600 {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
}

.export-btn.bg-purple-600:hover {
  background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(124, 58, 237, 0.4);
}

.export-btn:active {
  transform: translateY(0);
}
</style>