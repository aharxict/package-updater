export class FileUtils {
  static validatePackageJson(content: string): boolean {
    try {
      const json = JSON.parse(content);
      return json && typeof json === "object" && json.dependencies;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
