import Link from "next/link";

const TermsAndPrivacy: React.FC = () => {
  return (
    <p className="text-sm text-gray-500 text-center mt-4">
      By sharing your files or using our service, you agree to our{" "}
      <Link href="#" className="underline hover:text-gray-800">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link href="#" className="underline hover:text-gray-800">
        Privacy Policy
      </Link>
      .
    </p>
  );
};

export default TermsAndPrivacy;
