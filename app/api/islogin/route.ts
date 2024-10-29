import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
    const token = cookies().get("token")?.value;

    if (token) {
        const fetchRooms = await fetch("http://localhost:8080/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const responseRooms = await fetchRooms.json();
        if (fetchRooms.status != 200) {
            return NextResponse.json({ data: "Tidak login" }, { status: 401 });
        }
        return NextResponse.json({ data: "Sudah login" }, { status: 200 });
    }
    return NextResponse.json({ data: "Tidak login" }, { status: 401 });
}
