import { getCurrentUser, requireAuth } from "@/utils/auth";
import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL ORDERS
export const GET = async (req: NextRequest) => {
    // const authHeader = req.headers.get('authorization');

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return new NextResponse(
    //         JSON.stringify({ message: 'No token provided' }),
    //         { status: 401 }
    //     );
    // }

    // const token = authHeader.split(' ')[1]; // Get the token after 'Bearer '

    // const user = await getCurrentUser(token);

    // if (!user) {
    //     return new NextResponse(
    //         JSON.stringify({ message: 'You are not authenticated!' }),
    //         { status: 401 }
    //     );
    // }

    const { user, response } = await requireAuth(req);

    if (!user) return response!;

    try {
        if (user.isAdmin) {
            const orders = await prisma.order.findMany();
            return new NextResponse(JSON.stringify(orders), { status: 200 });
        }
        const orders = await prisma.order.findMany({
            where: {
                userEmail: user.email,
            },
        });
        return new NextResponse(JSON.stringify(orders), { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }

};

// CREATE ORDER
export const POST = async (req: NextRequest) => {
    const { user, response } = await requireAuth(req);

    if (!user) return response!;

    try {
        const body = await req.json();
        const order = await prisma.order.create({
            data: body,
        });
        return new NextResponse(JSON.stringify(order), { status: 201 });
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Something went wrong!" }),
            { status: 500 }
        );
    }
};