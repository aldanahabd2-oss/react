const team = [
  { name: 'Member One', studentId: '202XXXXX', role: 'Frontend / UI' },
  { name: 'Member Two', studentId: '202XXXXX', role: 'State & Features' },
  { name: 'Member Three', studentId: '202XXXXX', role: 'Testing & Docs' },
]

export default function AboutPage() {
  return (
    <section className="page narrow">
      <div className="page-header">
        <div>
          <h1>About</h1>
          <p>
            SE411 Project — Parts 1 & 2. React frontend integrated with a Spring
            Boot REST API for managing company computer assets (H2 database).
          </p>
        </div>
      </div>

      <div className="panel">
        <h2>Team Members</h2>
        <ul className="team-list">
          {team.map((member) => (
            <li key={member.studentId + member.name}>
              <strong>{member.name}</strong>
              <span>Student ID: {member.studentId}</span>
              <span className="muted">{member.role}</span>
            </li>
          ))}
        </ul>
        <p className="note">
          Replace the placeholder names and student IDs with your real team details
          before submission.
        </p>
      </div>
    </section>
  )
}
