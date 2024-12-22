import xss  from "xss";

export default class Security {
    public static sanitizeString(data: string): string {
        return xss(data);
    }
}
