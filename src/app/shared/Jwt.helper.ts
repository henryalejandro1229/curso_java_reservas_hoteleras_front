import { JwtPayload } from "../models/Auth.model";

export class JwtHelper {

    static decodeToken(token: string): JwtPayload | null {
        try {
            const encodedPayload = token.split('.')[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            const paddedPayload = encodedPayload.padEnd(
                Math.ceil(encodedPayload.length / 4) * 4,
                '='
            );
            const payload = JSON.parse(atob(paddedPayload));
            return payload;
        } catch (e) {
            return null;
        }
    }

    static isTokenExpired(token: string): boolean {
        const payload = this.decodeToken(token);
        if (!payload) return true;
        const now = Math.floor(Date.now() / 1000);
        return !payload.exp || payload.exp < now;
    }
}