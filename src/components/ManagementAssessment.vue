<!-- src/component/ManagementAssessment.vue -->
<template>
  <div class="survey-container">
    <!-- Copyright Notice Added Here -->
    <p class="copyright">Copyright @ 2025 HR Training Consultancy</p>
    
    <h1>HR Audit -- Management Assessment (BOD)</h1>
    <p class="instructions">
      Kindly complete and submit this Audit Assessment form on or before the due date.
    </p>
    <p class="confidential">
      Please be assured that your identity will not be revealed in our Audit analysis and report.
    </p>
    <p class="thanks">We appreciate your constructive assessment and comments. Thank you.</p>

    <hr class="divider">

    <form @submit.prevent="submitForm">
      <div class="form-section">
        <label for="name">NAME:</label>
        <input type="text" id="name" v-model="formData.name" required>
      </div>

      <!-- Rating Instructions -->
      <div class="rating-instructions">
        <h3>Audit Guidelines</h3>
      
        <div class="rating-scales">
          <div class="scale">
            <h4>Importance = Rate the <em>Importance</em> of each of the services provided</h4>
            <ul>
              <li>1 = Unimportant</li>
              <li>2 = Somewhat Important</li>
              <li>3 = Important</li>
              <li>4 = Very important</li>
              <li>NA = Not Applicable</li>
            </ul>
          </div>
          <div class="scale">
            <h4>Implementation = Rate the <em>Implementation Status</em> of each of the services provided</h4>
            <ul>
              <li>1 = None</li>
              <li>2 = Going to Implement / Partially implemented</li>
              <li>3 = Fully Implemented</li>
              <li>4 = Yes, well established</li>
              <li>NA = Not Applicable</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- HR1.0 Human Resource Department Management -->
      <div class="section">
        <h2>HR1.0 Human Resource Department Management</h2>
        
        <div class="rating-item" v-for="(item, index) in hr1Items" :key="'hr1-'+index">
          <div class="question">
            <p class="question-text">{{ item.text }}</p>
            <p class="question-desc" v-if="item.desc">{{ item.desc }}</p>
          </div>
          <div class="ratings">
            <div class="rating-col">
              <label>Importance:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr1-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr1[index].importance" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr1[index].importance" value="NA">
                  NA
                </label>
              </div>
            </div>
            <div class="rating-col">
              <label>Implementation:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr1-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr1[index].implementation" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr1[index].implementation" value="NA">
                  NA
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HR2.0 Human Resource Policies and Employee Handbook -->
      <div class="section">
        <h2>HR2.0 Human Resource Policies and Employee Handbook</h2>
        
        <div class="rating-item" v-for="(item, index) in hr2Items" :key="'hr2-'+index">
          <div class="question">
            <p class="question-text">{{ item.text }}</p>
            <p class="question-desc" v-if="item.desc">{{ item.desc }}</p>
          </div>
          <div class="ratings">
            <div class="rating-col">
              <label>Importance:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr2-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr2[index].importance" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr2[index].importance" value="NA">
                  NA
                </label>
              </div>
            </div>
            <div class="rating-col">
              <label>Implementation:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr2-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr2[index].implementation" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr2[index].implementation" value="NA">
                  NA
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HR3.0 Workforce Management -->
      <div class="section">
        <h2>HR3.0 Workforce Management</h2>
        
        <div class="rating-item" v-for="(item, index) in hr3Items" :key="'hr3-'+index">
          <div class="question">
            <p class="question-text">{{ item.text }}</p>
            <p class="question-desc" v-if="item.desc">{{ item.desc }}</p>
          </div>
          <div class="ratings">
            <div class="rating-col">
              <label>Importance:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr3-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr3[index].importance" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr3[index].importance" value="NA">
                  NA
                </label>
              </div>
            </div>
            <div class="rating-col">
              <label>Implementation:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr3-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr3[index].implementation" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr3[index].implementation" value="NA">
                  NA
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HR4.0 Compensation and Benefits and Performance Management -->
      <div class="section">
        <h2>HR4.0 Compensation and Benefits and Performance Management</h2>
        
        <div class="rating-item" v-for="(item, index) in hr4Items" :key="'hr4-'+index">
          <div class="question">
            <p class="question-text">{{ item.text }}</p>
            <p class="question-desc" v-if="item.desc">{{ item.desc }}</p>
          </div>
          <div class="ratings">
            <div class="rating-col">
              <label>Importance:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr4-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr4[index].importance" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr4[index].importance" value="NA">
                  NA
                </label>
              </div>
            </div>
            <div class="rating-col">
              <label>Implementation:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr4-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr4[index].implementation" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr4[index].implementation" value="NA">
                  NA
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HR5.0 Organizational Development -->
      <div class="section">
        <h2>HR5.0 Organizational Development</h2>
        
        <div class="rating-item" v-for="(item, index) in hr5Items" :key="'hr5-'+index">
          <div class="question">
            <p class="question-text">{{ item.text }}</p>
            <p class="question-desc" v-if="item.desc">{{ item.desc }}</p>
          </div>
          <div class="ratings">
            <div class="rating-col">
              <label>Importance:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr5-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr5[index].importance" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr5[index].importance" value="NA">
                  NA
                </label>
              </div>
            </div>
            <div class="rating-col">
              <label>Implementation:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr5-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr5[index].implementation" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr5[index].implementation" value="NA">
                  NA
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HR6.0 Employee Relations and Industrial Relations -->
      <div class="section">
        <h2>HR6.0 Employee Relations and Industrial Relations</h2>
        
        <div class="rating-item" v-for="(item, index) in hr6Items" :key="'hr6-'+index">
          <div class="question">
            <p class="question-text">{{ item.text }}</p>
            <p class="question-desc" v-if="item.desc">{{ item.desc }}</p>
          </div>
          <div class="ratings">
            <div class="rating-col">
              <label>Importance:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr6-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr6[index].importance" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr6[index].importance" value="NA">
                  NA
                </label>
              </div>
            </div>
            <div class="rating-col">
              <label>Implementation:</label>
              <div class="rating-options">
                <label v-for="n in 4" :key="'hr6-imp-'+index+'-'+n">
                  <input type="radio" v-model="formData.hr6[index].implementation" :value="n">
                  {{ n }}
                </label>
                <label>
                  <input type="radio" v-model="formData.hr6[index].implementation" value="NA">
                  NA
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HR7.0 Others -->
      <div class="section">
        <h2>HR7.0 Others</h2>
        
        <div class="open-ended">
          <label for="obstacles">
            i) What obstacles do you feel existed that prevent HR from efficiently and effectively 
            meeting the needs of the Management and internal customers, and preventing them from 
            accomplishing their tasks and goals?
          </label>
          <textarea 
            id="obstacles" 
            v-model="formData.obstacles" 
            maxlength="1000"
            rows="5"
          ></textarea>
          <div class="char-count">{{ formData.obstacles.length }}/1000</div>
        </div>
        
        <div class="open-ended">
          <label for="strengthsWeaknesses">
            ii) Please provide us with your view on the Strengths and Weaknesses of the current HR Team.
          </label>
          <textarea 
            id="strengthsWeaknesses" 
            v-model="formData.strengthsWeaknesses" 
            maxlength="1000"
            rows="5"
          ></textarea>
          <div class="char-count">{{ formData.strengthsWeaknesses.length }}/1000</div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Submit Assessment</button>
        <button type="button" class="reset-btn" @click="resetForm">Reset Form</button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import axios from "@/axios"

export default {
  setup() {
    // Initialize form data structure
    const formData = reactive({
      name: '',
      hr1: Array(6).fill().map(() => ({ importance: null, implementation: null })),
      hr2: Array(2).fill().map(() => ({ importance: null, implementation: null })),
      hr3: Array(10).fill().map(() => ({ importance: null, implementation: null })),
      hr4: Array(6).fill().map(() => ({ importance: null, implementation: null })),
      hr5: Array(4).fill().map(() => ({ importance: null, implementation: null })),
      hr6: Array(6).fill().map(() => ({ importance: null, implementation: null })),
      obstacles: '',
      strengthsWeaknesses: ''
    });

    // Questions for each section
    const hr1Items = [
      {
        text: "1. HR Strategic Initiatives and Relevancy",
        desc: "Activities related to the planning and execution of HR Goals and Strategies in supporting the organization and management to achieving organizational goals, sustainability and continuous growth. Includes HR special projects in promoting employer & employee relations, staff morale and employee's job satisfaction."
      },
      {
        text: "2. HR Team Vs. Total Organization Headcount (Ratio)",
        desc: "Number of HR personnel against the Organization overall Headcount. Is the current ratio adequate to meet business / HR services demand. Includes effective utilization of HR personnel."
      },
      {
        text: "3. HR Team Competencies",
        desc: "HR dept personnel competencies in handling overall HR scope and functionality in supporting organizational goals, sustainability and growth. Effectiveness of HR Administration in supporting the organization / departmental HR operations & problem solving. Ability to consistently achieve deadlines, includes promptness in resolving issue and responding to queries."
      },
      {
        text: "4. Human Resources Information Management / System (HRIS) and/or AI",
        desc: "Encompasses activities in leveraging HRIS &/or AI, includes utilizing employees' data, analysis & metrics for Management and Functional decision-making, operational improvement and optimization, etc."
      },
      {
        text: "5. Workplace Security, Safety and Health",
        desc: "Co-ordinate and delivering safety & security related activities in promoting security, safety & health awareness and compliant. Includes maintaining safety & security records, complying with authorities' enforcement and updates."
      },
      {
        text: "6. Crisis Management",
        desc: "Ability to handle crisis with minima operation's disruption, and shows resourcefulness whilst maintaining compliances."
      }
    ];

    const hr2Items = [
      {
        text: "1. HR Policies & Employee Handbook and Relevancy",
        desc: "Includes the overall management and administration of the Human Resource Policies and Employee Handbook. The alignment of HR Policies with the Company's Objectives, Strategies, Culture and Core Values. To what extent do the HR policies support the Company in executing it's strategies, operations and competitiveness. Monitoring Policies compliances and enforcement. Review and updates of policies and employee handbook."
      },
      {
        text: "2. Communication and Awareness",
        desc: "To what extent do the HR policies being communicated to employees and sufficient awareness activities being conducted to facilitate compliant and enforcement."
      }
    ];

    const hr3Items = [
      {
        text: "1. Workforce Forecasting & Planning",
        desc: "Activities involving the preparation and projection of Manpower Planning and Forecasting."
      },
      {
        text: "2. External and Internal Sourcing",
        desc: "Resourcefulness and creativeness in sourcing of candidates through various means. Indicate the existence of Employee Referral Scheme or Incentive as part of recruitment strategy."
      },
      {
        text: "3. Selection Tools",
        desc: "Indicate the existence of Competencies or Skills Matrix. Includes usage of Job Description and Behavioral or various assessment for recruitment, career path building and talent management selection purposes."
      },
      {
        text: "4. Recruitment and Selection process",
        desc: "Activities and Policies related to the preparation, approving, posting, and tracking requisitions to fill a position. Activities and Policies associated with identifying candidate pools, screening of candidates, interviewing, educating hiring managers, notifying applicants and determining the new hires compensation."
      },
      {
        text: "5. Pre-selection Checks",
        desc: "Activities of reference or background checking shortlisted candidates prior to job offer."
      },
      {
        text: "6. Recruitment Turn-around-Time",
        desc: "Monitoring and recording of Recruitment Turn-around-time. (Time-to-Hire)"
      },
      {
        text: "7. Orienting New Hires / Onboarding",
        desc: "Activities and Polices associated with orientation of new hires. Preparation & activities before and after the arrival of new hires."
      },
      {
        text: "8. Career Development and Succession Planning",
        desc: "Existence of Policies or programs on the development and tracking of employee's Career Development Plan, Succession Planning program and Business Continuity Planning."
      },
      {
        text: "9. Employee Headcount Reporting & Maintenance",
        desc: "Activities and Policies associated with maintaining and processing employee progress and movement such as promotions, transfers, employee personal updates, etc. Includes providing headcount information and updates to relevant parties."
      },
      {
        text: "10. Employee Separations",
        desc: "Activities and Policies related to exiting employees, including conducting exit interviews, etc."
      }
    ];

    const hr4Items = [
      {
        text: "1. Employees Compensation and Benefits Management",
        desc: "Activities involved with managing employee's compensation and benefits, includes revision and benchmarking. Activities associated with updating pay policies, determining internal and external competitiveness of pay, determining merit pay increases, and processing of corresponding documentations. Is pay structure being review consistently and compensation & benefits being compared with market rates."
      },
      {
        text: "2. Employee's Welfare Plans and Programs",
        desc: "Services encompassing employee's welfare programs and activities, includes safety, health and spiritual wellness."
      },
      {
        text: "3. Incentive-based Pay Programs",
        desc: "Services related to the design and enhancement of incentive schemes and the corresponding administrative activities. Developing strategies and plans to retain the top talent."
      },
      {
        text: "4. Payroll Management and Administration",
        desc: "Policies and Checklist to ensure consistent Statutory compliances, accuracy and on-schedule Payroll processes. Incident of non-compliance, penalty and delayed payroll? Includes frequency of Payroll related complaints from employees and ability of HR staff in handling Payroll related queries and problem solving."
      },
      {
        text: "5. Performance Management System",
        desc: "Encompasses services around developing or enhancing performance management systems including developing performance targets, and the corresponding monitoring and administration of the programs and activities."
      },
      {
        text: "6. Feedback and Performance Improvement",
        desc: "Activities in providing mentoring and coaching programs. Providing PIP (performance improvement plan) and Counseling programs and activities. Administration and communication of the above programs."
      }
    ];

    const hr5Items = [
      {
        text: "1. Learning & Development - Training Administration",
        desc: "Activities associated with identifying organizational, departmental and individual gap analysis and training needs. Planning and managing training programs including designing, developing and delivering of training programs for current and future needs. Includes leadership development programs and employee's career development programs."
      },
      {
        text: "2. Training Plan - Budget and Training Hours",
        desc: "Indicate existence of Annual Training Plan includes allocation of training budget and employee's targeted training hours, and activities around it."
      },
      {
        text: "3. Training Evaluation and Effectiveness",
        desc: "Evaluating effectiveness of training programs. Follow-ups and enhancement or revision of programs to ensure training objectives are achieved."
      },
      {
        text: "4. Knowledge Management and Organizational Change",
        desc: "Encompasses services around developing and maintaining feedback and knowledge management system and activities. Are they sufficient means and ways for employees to contribute their knowledge and skills for job satisfaction, self and career development, whilst contributing to the company's objectives achievement, growth and sustainability. Includes programs and activities in leading employees through organizational change and knowledge management."
      }
    ];

    const hr6Items = [
      {
        text: "1. Business Unit Manager / HOD Relationship",
        desc: "Encompasses all activities associated with understanding the needs and expectations of the business units. Includes time spent with managers to assess individual needs, one-on-one consultations, coaching, feedback management, etc."
      },
      {
        text: "2. Employee Relations and Open Communication",
        desc: "Activities such as Townhall or HR Dialogue, includes communicating with employees through various platform and mechanisms on the Company's programs, initiatives, etc., and to obtain employee's feedback on regular basis. Includes responding to employee's concerns and issues speedily."
      },
      {
        text: "3. Workplace Programs",
        desc: "Includes all activities associated with recognizing employee performance and contributions in non-monetary ways. Delivering diversity-related programs including programs for work-life balance, team relationship enhancement, etc."
      },
      {
        text: "4. Industrial Relations (IR)",
        desc: "The efficient and effective handling of employee's grievances and misconduct. Includes preventive measures against discrimination and harassment, etc. Prompt and effective problem solving and closure of IR issues with minimal risk and employment law compliant."
      },
      {
        text: "5. IR Legal Compliance",
        desc: "The consistent tracking of changes in Employment Law and IR legal requirement. Includes reporting and communicating employment related legal requirements and latest updates to BOD / Management and HODs / Business Units."
      },
      {
        text: "6. HR Team competencies in IR",
        desc: "HR Team knowledge, skills and capabilities in handling IR matters efficiently and effectively. Includes providing HR and IR advisory on Employment Law and IR Legality compliant in managing employees and when handling employment dispute."
      }
    ];

    const submitForm = async () => {
      try {
        const payload = { ...formData };
        const res = await axios.post("/api/management", payload);

        if (res.data.success) {
          alert("✅ Thank you for submitting your assessment!");
          resetForm();
        } else {
          alert("⚠️ " + (res.data.message || "Something went wrong"));
        }
      } catch (err) {
        console.error("Submission error:", err);
        alert("❌ Failed to submit. Please try again.");
      }
    }

    const resetForm = () => {
      if (confirm('Are you sure you want to reset the form? All your inputs will be lost.')) {
        formData.name = '';
        formData.hr1.forEach(item => {
          item.importance = null;
          item.implementation = null;
        });
        formData.hr2.forEach(item => {
          item.importance = null;
          item.implementation = null;
        });
        formData.hr3.forEach(item => {
          item.importance = null;
          item.implementation = null;
        });
        formData.hr4.forEach(item => {
          item.importance = null;
          item.implementation = null;
        });
        formData.hr5.forEach(item => {
          item.importance = null;
          item.implementation = null;
        });
        formData.hr6.forEach(item => {
          item.importance = null;
          item.implementation = null;
        });
        formData.obstacles = '';
        formData.strengthsWeaknesses = '';
      }
    };

    return {
      formData,
      hr1Items,
      hr2Items,
      hr3Items,
      hr4Items,
      hr5Items,
      hr6Items,
      submitForm,
      resetForm
    };
  }
};
</script>

<style>
/* Base styles */
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
  margin: 0;
  padding: 20px;
}

.survey-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

/* Copyright Notice Styles */
.copyright {
  color: blue;
  font-style: italic;
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
}

h1, h2, h3, h4 {
  color: #2c3e50;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
}

h2 {
  font-size: 20px;
  margin-top: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #3498db;
}

h3 {
  font-size: 18px;
  margin-top: 20px;
}

.divider {
  border: 0;
  height: 1px;
  background: #ddd;
  margin: 20px 0;
}

.instructions, .confidential, .thanks {
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
}

.confidential {
  color: #e74c3c;
  font-weight: bold;
}

/* Form elements */
.form-section {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.rating-instructions {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.rating-scales {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.scale {
  flex: 1;
  background: white;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #eee;
}

.scale h4 {
  margin-top: 0;
  font-size: 16px;
}

.scale ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.scale li {
  margin-bottom: 5px;
}

/* Rating items */
.section {
  margin-bottom: 30px;
}

.rating-item {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.question-text {
  font-weight: bold;
  margin: 0 0 5px 0;
}

.question-desc {
  margin: 5px 0 10px 0;
  font-size: 14px;
  color: #555;
}

.ratings {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.rating-col {
  flex: 1;
}

.rating-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.rating-options label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
  cursor: pointer;
}

.rating-options input[type="radio"] {
  margin: 0;
}

/* Open-ended questions */
.open-ended {
  margin-bottom: 20px;
}

.open-ended label {
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
}

.char-count {
  font-size: 12px;
  color: #777;
  text-align: right;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn {
  background-color: #3498db;
  color: white;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.reset-btn {
  background-color: #e74c3c;
  color: white;
}

.reset-btn:hover {
  background-color: #c0392b;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .survey-container {
    padding: 15px;
  }
  
  .ratings {
    flex-direction: column;
    gap: 10px;
  }
  
  .rating-scales {
    flex-direction: column;
    gap: 10px;
  }
}
</style>