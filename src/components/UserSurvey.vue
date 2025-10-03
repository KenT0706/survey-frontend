<!-- src/components/UserSurvey.vue -->
<template>
  <div class="survey-container">
  <!-- Copyright Notice Added Here -->
    <p class="copyright">Copyright @ 2025 HR Training Consultancy</p>
    
    <h1>HR Audit - Users Survey (HOD)</h1>
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

      <div class="form-section">
        <label for="position">POSITION:</label>
        <input type="text" id="position" v-model="formData.position" required>
      </div>

      <div class="form-section">
        <label for="department">DEPARTMENT:</label>
        <input type="text" id="department" v-model="formData.department" required>
      </div>

      <div class="form-section date-joined">
        <label>DATE JOINED:</label>
        <div class="date-inputs">
          <input type="number" v-model="formData.dateJoinedDay" min="1" max="31" placeholder="DD" required>
          <span>MTH</span>
          <input type="number" v-model="formData.dateJoinedMonth" min="1" max="12" placeholder="MM" required>
          <span>YEAR</span>
          <input type="number" v-model="formData.dateJoinedYear" :min="new Date().getFullYear() - 90" :max="new Date().getFullYear()" placeholder="YYYY" required>
        </div>
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
            meeting your needs as the internal customers?
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
          <label for="suggestions">
            ii) Do you have any suggestions that may elevate the efficiency and effectiveness of 
            the HR functionality and departmental management and operations.
          </label>
          <textarea 
            id="suggestions" 
            v-model="formData.suggestions" 
            maxlength="1000"
            rows="5"
          ></textarea>
          <div class="char-count">{{ formData.suggestions.length }}/1000</div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">Submit Survey</button>
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
      position: '',
      department: '',
      dateJoinedDay: null,
      dateJoinedMonth: null,
      dateJoinedYear: null,
      hr1: Array(4).fill().map(() => ({ importance: null, implementation: null })),
      hr2: Array(2).fill().map(() => ({ importance: null, implementation: null })),
      hr3: Array(8).fill().map(() => ({ importance: null, implementation: null })),
      hr4: Array(6).fill().map(() => ({ importance: null, implementation: null })),
      hr5: Array(3).fill().map(() => ({ importance: null, implementation: null })),
      hr6: Array(4).fill().map(() => ({ importance: null, implementation: null })),
      obstacles: '',
      suggestions: ''
    });

    // Questions for each section
    const hr1Items = [
      {
        text: "A. HR Management, Initiatives and Relevancy",
        desc: "Activities related to the planning and execution of HR programs, initiatives and activities in supporting the organizational goals, sustainability and continuous growth. Effectiveness of HR Management & Administration in supporting the organization and departmental HR operations & problem solving, and preventive initiatives (not just fire-fighting). HR special projects in promoting employer & employee relations, staff morale and employee's job satisfaction."
      },
      {
        text: "B. Human Resources Information Management / System (HRIS) and/or AI",
        desc: "Encompasses activities in leveraging HRIS &/or AI, includes utilizing employees' data, analysis & metrics for Management and Functional decision-making, operational improvement and optimization, etc."
      },
      {
        text: "C. Workplace Security, Safety and Health",
        desc: "Co-ordinate and delivering safety & security related activities in promoting security, safety & health awareness and compliant. Includes maintaining safety & security records, complying with authorities' enforcement and updates."
      },
      {
        text: "D. Crisis Management",
        desc: "Ability to handle crisis with minima operation's disruption, and shows resourcefulness whilst maintaining compliances."
      }
    ];

    const hr2Items = [
      {
        text: "A. HR Policies & Employee Handbook and Relevancy",
        desc: "Includes the overall management and administration of the Human Resource Policies and Employee Handbook. To what extent do the HR policies support the Company in executing it's strategies, operations and competitiveness. Monitoring Policies compliances and enforcement. Review and updates of policies and employee handbook."
      },
      {
        text: "B. Communication and Awareness",
        desc: "To what extent do the HR policies being communicated to employees and sufficient awareness activities being conducted to facilitate compliant and enforcement."
      }
    ];

    const hr3Items = [
      {
        text: "A. Workforce Forecasting & Planning",
        desc: "Activities involving the preparation and projection of Manpower Planning and Forecasting."
      },
      {
        text: "B. External and Internal Sourcing",
        desc: "Resourcefulness and creativeness in sourcing of candidates through various means."
      },
      {
        text: "C. Recruitment and Selection process",
        desc: "Activities and Policies related to the preparation, approving, posting, and tracking requisitions to fill a position. Activities and Policies associated with identifying candidate pools, screening of candidates, interviewing, educating hiring managers, notifying applicants and determining the new hires compensation."
      },
      {
        text: "D. Pre-selection Checks",
        desc: "Activities of reference or background checking shortlisted candidates prior to job offer."
      },
      {
        text: "E. Recruitment Turn-around-Time",
        desc: "Monitoring and recording of Recruitment Turn-around-time. (Time-to-Hire)"
      },
      {
        text: "F. Orienting New Hires / Onboarding",
        desc: "Activities and Polices associated with orientation of new hires. Preparation & activities before and after the arrival of new hires."
      },
      {
        text: "G. Career Development and Succession Planning",
        desc: "Existence of Policies or programs on the development and tracking of employee's Career Development Plan, Succession Planning program and Business Continuity Planning."
      },
      {
        text: "H. Employee Headcount Reporting & Maintenance",
        desc: "Activities and Policies associated with maintaining and processing employee progress and movement such as promotions, transfers, employee personal updates, etc. Includes providing headcount information and updates to relevant parties."
      }
    ];

    const hr4Items = [
      {
        text: "A. Employees Compensation and Benefits Management",
        desc: "Is pay structure being review consistently and compensation & benefits being compared with market rates. Includes determining internal and external competitiveness of pay and determining merit pay increases."
      },
      {
        text: "B. Employee's Welfare Plans and Programs",
        desc: "Services encompassing employee's welfare programs and activities, includes safety, health and spiritual wellness."
      },
      {
        text: "C. Incentive-based Pay Programs",
        desc: "Services related to the design and enhancement of incentive schemes and the corresponding administrative activities. Developing strategies and plans to retain the top talent."
      },
      {
        text: "D. Payroll Administration",
        desc: "Indicate existence of delayed payroll and/or inaccuracy of Payroll computation or process. Includes frequency of Payroll related complaints from employees and ability of HR staff in handling employee's Payroll related queries and problem solving."
      },
      {
        text: "E. Performance Management System",
        desc: "Encompasses services around developing or enhancing performance management systems including developing performance targets, and the corresponding monitoring and administration of the programs and activities."
      },
      {
        text: "F. Feedback and Performance Improvement",
        desc: "Activities in providing mentoring and coaching programs. Providing PIP (performance improvement plan) and Counseling programs and activities. Administration and communication of the above programs."
      }
    ];

    const hr5Items = [
      {
        text: "A. Learning & Development - Training Administration",
        desc: "Activities associated with identifying organizational, departmental and individual gap analysis and training needs. Existence of Training budget allocation and training hours. Planning and managing training programs including designing, developing and delivering of training programs for current and future needs. Includes leadership development programs and employee's career development programs."
      },
      {
        text: "B. Training Evaluation and Effectiveness",
        desc: "Evaluating effectiveness of training programs. Follow-ups and enhancement or revision of programs to ensure training objectives are achieved."
      },
      {
        text: "C. Knowledge Management and Organizational Change",
        desc: "Encompasses services around developing and maintaining feedback and knowledge management system and activities. Are they sufficient means and ways for employees to contribute their knowledge and skills for job satisfaction, self and career development, whilst contributing to the company's objectives achievement, growth and sustainability. Includes programs and activities in leading employees through organizational change and knowledge management."
      }
    ];

    const hr6Items = [
      {
        text: "A. Business Unit Manager / HOD Relationship",
        desc: "Encompasses all activities associated with understanding the needs and expectations of the business units. Includes time spent with managers to assess individual needs, one-on-one consultations, coaching, feedback management, etc."
      },
      {
        text: "B. Employee Relations and Open Communication",
        desc: "Activities such as Townhall or HR Dialogue, includes communicating with employees through various platform and mechanisms on the Company's programs, initiatives, etc., and to obtain employee's feedback on regular basis. Includes responding to employee's concerns and issues speedily."
      },
      {
        text: "C. Workplace Programs",
        desc: "Includes all activities associated with recognizing employee performance and contributions in non-monetary ways. Delivering diversity-related programs including programs for work-life balance, team relationship enhancement, etc."
      },
      {
        text: "D. Industrial Relations (IR)",
        desc: "The efficient and effective handling of employee's grievances and misconduct. Includes preventive measures against discrimination and harassment, etc. Prompt and effective problem solving and closure of IR issues with minimal risk and employment law compliant. Includes communicating employment related legal requirements and updates to HODs / Business Units."
      }
    ];

    

const submitForm = async () => {
  try {
    // Format the date properly
    const dateJoined = `${formData.dateJoinedDay}/${formData.dateJoinedMonth}/${formData.dateJoinedYear}`;
    
    const payload = {
      name: formData.name,
      position: formData.position,
      department: formData.department,
      dateJoined: dateJoined,
      submissionDate: new Date().toISOString(),
      hr1: formData.hr1,
      hr2: formData.hr2,
      hr3: formData.hr3,
      hr4: formData.hr4,
      hr5: formData.hr5,
      hr6: formData.hr6,
      obstacles: formData.obstacles,
      suggestions: formData.suggestions
    };

    console.log('Submitting payload:', payload); // Debug log

       const res = await axios.post("/api/user-survey", payload);

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
        formData.position = '';
        formData.department = '';
        formData.dateJoinedDay = null;
        formData.dateJoinedMonth = null;
        formData.dateJoinedYear = null;
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
        formData.suggestions = '';
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

/* Copyright Notice Styles */
.copyright {
  color: blue;
  font-style: italic;
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
}

<style scoped>
/* Add any specific styles for the user survey form here */
.date-joined {
  margin-bottom: 20px;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-inputs input {
  width: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.date-inputs span {
  font-weight: bold;
  margin: 0 5px;
}
</style>