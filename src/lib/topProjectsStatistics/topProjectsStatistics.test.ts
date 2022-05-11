import { getAllTimeTopProjects } from "./topProjectsStatistics";

describe("topProjectsStatistics", () => {
  it("has 0 entries", () => {
    const result = getAllTimeTopProjects([]);
    expect(result).toEqual([]);
  });

  it("has multiple entries of 1 project", () => {
    const result = getAllTimeTopProjects([
      { project_name: "p1", duration: 10 },
      { project_name: "p1", duration: 5 },
      { project_name: "p1", duration: 7 }
    ]);

    expect(result).toEqual([
      { project_name: "p1", duration: 22 }
    ]);
  });

  it("has multiple entries of 2 projects, where p2 has more time", () => {
    const result = getAllTimeTopProjects([
      { project_name: "p1", duration: 10 },
      { project_name: "p2", duration: 50 },
      { project_name: "p1", duration: 5 },
      { project_name: "p2", duration: 30 },
      { project_name: "p1", duration: 7 }
    ]);

    expect(result).toEqual([
      { project_name: "p2", duration: 80 },
      { project_name: "p1", duration: 22 }
    ]);
  });

  it("has multiple entries of 2 projects, where p2 has more time", () => {
    const result = getAllTimeTopProjects([
      { project_name: "p2", duration: 10 },
      { project_name: "p1", duration: 50 },
      { project_name: "p2", duration: 5 },
      { project_name: "p1", duration: 30 },
      { project_name: "p2", duration: 7 }
    ]);

    expect(result).toEqual([
      { project_name: "p1", duration: 80 },
      { project_name: "p2", duration: 22 }
    ]);
  });
});