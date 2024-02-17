import { notFound } from "next/navigation";
import Link from "next/link";
import db from "@/app/Helpers/prisma";
import SnippetEditForm from "@/app/Editor/snippet-edit-form";

interface SnippetEditPageProps {
    params: {
        id: string;
    };
}

export default async function SnippetEditPage(props: SnippetEditPageProps) {
    const id = parseInt(props.params.id);

    const snippet = await db.snippet.findFirst({
        where: { id },
    });

    if (!snippet) {
        return notFound();
    }

    return (
        <SnippetEditForm snippet={snippet}/>
    );
}
