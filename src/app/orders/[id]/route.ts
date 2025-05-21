import { NextResponse } from "next/server";

export const PUT = async ({ params }: { params: { id: string } }) => {
	const { id } = params;

	try {

	} catch (err) {
		console.log(err);
		return new NextResponse(
			JSON.stringify({ message: "Something went wrong!" }),
			{ status: 500 }
		);
	}
}