import Link from "next/link";

/**
 * TermsAndPrivacy component
 *
 * This component displays a disclaimer paragraph informing users
 * that by using the service or uploading files, they agree to the
 * Terms of Service and Privacy Policy.
 *
 * Important: No actual links are provided here. Please replace the
 * `#` symbol in the href attributes with the correct URLs before release.
 */
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
