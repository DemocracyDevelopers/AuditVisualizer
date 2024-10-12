import Link from "next/link";

interface HelpLinkProps {
  linkText: string;
  linkHref: string;
}

const TutorialLink: React.FC<HelpLinkProps> = ({ linkText, linkHref }) => {
  return (
    <p className="text-center text-lg text-gray-600 my-4">
      Need help? Click{" "}
      <Link href={linkHref} className="text-blue-600 hover:underline">
        {linkText}
      </Link>{" "}
      for a tutorial.
    </p>
  );
};

export default TutorialLink;
