import { SkillCard, type SkillCardData } from "./SkillCard"

export function SkillGrid({ skills }: { skills: SkillCardData[] }) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No skills found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}
