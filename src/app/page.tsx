"use client";

import { useState, useEffect } from "react";

interface Build {
  name: string;
  version: string;
  platform: "Android" | "iOS";
  url: string;
  bundleId: string;
  plistUrl?: string;
}

interface ChangelogItem {
  type: "bug" | "feature" | "improvement";
  category: string;
  description: string;
}

type UserRole = "standard" | "express" | "qc" | null;
type DevicePlatform = "Android" | "iOS" | "unknown";

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [activeTab, setActiveTab] = useState<"builds" | "changelog">("builds");
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [devicePlatform, setDevicePlatform] =
    useState<DevicePlatform>("unknown");

  useEffect(() => {
    setOrigin(window.location.origin);

    // Detect user's device platform
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setDevicePlatform("Android");
    } else if (
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    ) {
      setDevicePlatform("iOS");
    }
  }, []);

  const builds: Build[] = [
    {
      name: "Standard Delivery App (Android)",
      version: "v3.6.2",
      platform: "Android",
      url: "https://camsusermgmtmaster.blob.core.windows.net/app/Android/cwings-prod-v3.6.2.apk",
      bundleId: "com.maf.delivery.cwings",
    },
    {
      name: "Express Delivery App (Android)",
      version: "v3.6.2",
      platform: "Android",
      url: "https://camsusermgmtmaster.blob.core.windows.net/app/Android/ewings-prod-v3.6.2.apk",
      bundleId: "com.maf.delivery.ewings",
    },
    {
      name: "Standard Delivery App (iOS)",
      version: "v3.6.2",
      platform: "iOS",
      url: "https://camsusermgmtmaster.blob.core.windows.net/app/iOS/cwings-prod-v3.6.2.ipa",
      bundleId: "com.maf.delivery.cwings",
      plistUrl: "/manifests/cwings.plist",
    },
    {
      name: "Express Delivery App (iOS)",
      version: "v3.6.2",
      platform: "iOS",
      url: "https://camsusermgmtmaster.blob.core.windows.net/app/iOS/ewings-prod-v3.6.2.ipa",
      bundleId: "com.maf.delivery.ewings",
      plistUrl: "/manifests/ewings.plist",
    },
  ];

  const changelog: ChangelogItem[] = [
    {
      type: "bug",
      category: "Standard",
      description:
        "END route button appearing incorrectly for rescheduled orders in preparation status.",
    },
    {
      type: "feature",
      category: "Standard",
      description: "Auto-update orders when assignment/un-assignment occurs.",
    },
    {
      type: "feature",
      category: "Standard",
      description: "Auto-update route when route is assigned to the driver.",
    },
    {
      type: "feature",
      category: "Standard",
      description:
        'Introduction of the "Start Delivery" CTA in standard flow. OTP generation removed at handover; now triggered during "Start Delivery" action.',
    },
    {
      type: "feature",
      category: "Standard",
      description:
        "New Standard Order Sequencing - Removal of the outdated re-sequencing flow.",
    },
    {
      type: "feature",
      category: "Standard",
      description: "OTP triggers based on threshold limits for order value.",
    },
    {
      type: "feature",
      category: "Standard",
      description:
        "Display an info message to drivers when an order is assigned to a helper within consignment info screen.",
    },
    {
      type: "feature",
      category: "Express",
      description: "Introduced OTP verification for express orders.",
    },
    {
      type: "feature",
      category: "Express",
      description:
        "Implemented order value-based OTP triggering for express deliveries.",
    },
    {
      type: "bug",
      category: "Delve",
      description: "Wrong items not displaying in consignment history.",
    },
    {
      type: "bug",
      category: "Delve",
      description:
        "Delve dynamic URL used getting un-ordered products (wrong products) in QC summary screen.",
    },
    {
      type: "improvement",
      category: "Common",
      description:
        "Removed cwings_report API references and replaced the fetchInvoice endpoint with fulfilmentReport across both Express and Standard flows. Removed API_URL_DELVE.",
    },
    {
      type: "improvement",
      category: "Common",
      description:
        "Removed the console transformation plugin and its related configuration in the production environment.",
    },
    {
      type: "improvement",
      category: "Common",
      description:
        "Improved logging by pushing logger.track logs directly to New Relic for better monitoring and analysis.",
    },
  ];

  const getIosInstallUrl = (plistUrl: string): string => {
    return `itms-services://?action=download-manifest&url=${origin}${plistUrl}`;
  };

  // Filter builds based on selected role and prioritize by device platform
  const getFilteredBuilds = () => {
    if (!selectedRole) return [];

    let filteredBuilds = builds.filter((build) => {
      if (selectedRole === "standard" && build.name.includes("Standard")) {
        return true;
      }
      if (selectedRole === "express" && build.name.includes("Express")) {
        return true;
      }
      if (selectedRole === "qc" && build.name.includes("Standard")) {
        return true;
      }
      return false;
    });

    // Sort builds to prioritize the user's device platform
    if (devicePlatform !== "unknown") {
      filteredBuilds.sort((a, b) => {
        if (a.platform === devicePlatform && b.platform !== devicePlatform) {
          return -1;
        }
        if (a.platform !== devicePlatform && b.platform === devicePlatform) {
          return 1;
        }
        return 0;
      });
    }

    return filteredBuilds;
  };

  // Role selection screen
  const renderRoleSelection = () => {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary-900)]">
          Please Select Your Role
        </h2>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Select your role below to install the appropriate Wings application
        </p>

        <div className="space-y-4">
          <button
            onClick={() => setSelectedRole("standard")}
            className="w-full py-5 px-4 bg-white border-2 border-[var(--primary-300)] hover:border-[var(--primary-500)] rounded-lg flex items-center justify-between transition-all"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-700)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium">Standard Driver</h3>
                <p className="text-gray-600">
                  For standard delivery operations
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          <button
            onClick={() => setSelectedRole("express")}
            className="w-full py-5 px-4 bg-white border-2 border-[var(--primary-300)] hover:border-[var(--primary-500)] rounded-lg flex items-center justify-between transition-all"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-700)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium">Express Driver</h3>
                <p className="text-gray-600">For express delivery operations</p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          <button
            onClick={() => setSelectedRole("qc")}
            className="w-full py-5 px-4 bg-white border-2 border-[var(--primary-300)] hover:border-[var(--primary-500)] rounded-lg flex items-center justify-between transition-all"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-700)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium">QC Executive</h3>
                <p className="text-gray-600">For quality control operations</p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Show role-specific app information
  const getRoleInfo = () => {
    switch (selectedRole) {
      case "standard":
        return "Standard Driver App";
      case "express":
        return "Express Driver App";
      case "qc":
        return "QC Executive App (Standard)";
      default:
        return "";
    }
  };

  return (
    <div className="pb-8 max-w-4xl mx-auto">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-[var(--primary-900)]">
          Wings Apps v3.6.2
        </h1>

        {!selectedRole ? (
          renderRoleSelection()
        ) : (
          <>
            {/* Role indicator */}
            <div className="mb-6 flex justify-center">
              <div className="bg-[var(--primary-50)] text-[var(--primary-900)] px-4 py-2 rounded-full flex items-center">
                <button
                  onClick={() => setSelectedRole(null)}
                  className="mr-2 p-1 rounded-full bg-[var(--primary-100)] hover:bg-[var(--primary-200)] transition-colors"
                  aria-label="Back to role selection"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-[var(--primary-700)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                </button>
                <span className="font-medium">{getRoleInfo()}</span>
              </div>
            </div>

            {/* AppCenter-like tabs */}
            <div className="border-b border-[var(--card-border)] mb-6">
              <div className="flex">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "builds"
                      ? "border-b-2 border-[var(--primary-700)] text-[var(--primary-800)]"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("builds")}
                >
                  Builds
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "changelog"
                      ? "border-b-2 border-[var(--primary-700)] text-[var(--primary-800)]"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("changelog")}
                >
                  Changelog
                </button>
              </div>
            </div>

            {activeTab === "builds" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFilteredBuilds().map((build, index) => (
                  <div
                    key={index}
                    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-sm overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-[var(--card-header)] border-b border-[var(--card-border)]">
                      <div className="flex justify-between items-center">
                        <h2 className="text-base font-semibold">
                          {build.name}
                        </h2>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            build.platform === "Android"
                              ? "bg-[var(--primary-100)] text-[var(--primary-900)]"
                              : "bg-[var(--primary-50)] text-[var(--primary-800)]"
                          }`}
                        >
                          {build.platform}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="text-sm text-gray-600 mb-4">
                        <div className="flex justify-between mb-1">
                          <span>Version:</span>
                          <span className="font-medium">{build.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bundle ID:</span>
                          <span className="font-mono text-xs">
                            {build.bundleId}
                          </span>
                        </div>
                      </div>

                      {build.platform === "Android" ? (
                        <a
                          href={build.url}
                          className="block w-full bg-[var(--primary-700)] hover:bg-[var(--primary-800)] text-white text-center font-medium py-2 rounded transition-colors"
                          download
                        >
                          Download APK
                        </a>
                      ) : (
                        <a
                          href={
                            origin && build.plistUrl
                              ? getIosInstallUrl(build.plistUrl)
                              : "#"
                          }
                          className="block w-full bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white text-center font-medium py-2 rounded transition-colors"
                          onClick={(e) => {
                            if (!origin) {
                              e.preventDefault();
                              alert(
                                "Please wait while the page finishes loading..."
                              );
                            }
                          }}
                        >
                          Install on iOS
                        </a>
                      )}

                      {build.platform === "iOS" && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                          <div className="font-medium mb-2">
                            iOS Installation Guide:
                          </div>
                          <ol className="list-decimal ml-4 space-y-2">
                            <li>Tap the Install button above</li>
                            <li>When prompted, tap &ldquo;Allow&rdquo;</li>
                            <li>
                              Return to the home screen and look for the app
                              icon
                            </li>
                            <li className="font-medium">
                              When you see &ldquo;Untrusted Enterprise
                              Developer&rdquo; message:
                            </li>
                            <li className="ml-4">
                              <ol className="list-disc space-y-1">
                                <li>
                                  Go to Settings &gt; General &gt; VPN & Device
                                  Management
                                </li>
                                <li>
                                  Under &ldquo;Enterprise App&rdquo; section,
                                  tap the MAF profile
                                </li>
                                <li>
                                  Tap &ldquo;Trust [Developer Name]&rdquo;
                                </li>
                                <li>
                                  Confirm by tapping &ldquo;Trust&rdquo; in the
                                  popup
                                </li>
                              </ol>
                            </li>
                            <li>Return to the home screen and open the app</li>
                          </ol>
                        </div>
                      )}

                      {build.platform === "Android" && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                          <div className="font-medium mb-2">
                            Android Installation Guide:
                          </div>
                          <ol className="list-decimal ml-4 space-y-2">
                            <li>Tap the Download APK button above</li>
                            <li>
                              If prompted about the file being harmful, tap
                              &ldquo;Download anyway&rdquo;
                            </li>
                            <li>
                              Open the downloaded file from your notifications
                              or file manager
                            </li>
                            <li>
                              If you see a security warning about installing
                              unknown apps:
                            </li>
                            <li className="ml-4">
                              <ol className="list-disc space-y-1">
                                <li>Tap &ldquo;Settings&rdquo; on the popup</li>
                                <li>
                                  Enable &ldquo;Allow from this source&rdquo;
                                </li>
                                <li>Go back and continue the installation</li>
                              </ol>
                            </li>
                            <li>
                              Tap &ldquo;Install&rdquo; and wait for
                              installation to complete
                            </li>
                            <li>Tap &ldquo;Open&rdquo; to launch the app</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "changelog" && (
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-[var(--card-header)] border-b border-[var(--card-border)]">
                  <h2 className="text-base font-semibold">
                    Version v3.6.2 Changes
                  </h2>
                </div>

                <div className="p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-red-600">
                        Bug Fixes
                      </h3>
                      <ul className="space-y-2">
                        {changelog
                          .filter((item) => item.type === "bug")
                          .map((item, index) => (
                            <li key={index} className="text-sm">
                              <span className="inline-block w-20 font-medium text-gray-600">
                                {item.category}:
                              </span>
                              {item.description}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-[var(--primary-700)]">
                        New Features
                      </h3>
                      <ul className="space-y-2">
                        {changelog
                          .filter((item) => item.type === "feature")
                          .map((item, index) => (
                            <li key={index} className="text-sm">
                              <span className="inline-block w-20 font-medium text-gray-600">
                                {item.category}:
                              </span>
                              {item.description}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-green-600">
                        Improvements
                      </h3>
                      <ul className="space-y-2">
                        {changelog
                          .filter((item) => item.type === "improvement")
                          .map((item, index) => (
                            <li key={index} className="text-sm">
                              <span className="inline-block w-20 font-medium text-gray-600">
                                {item.category}:
                              </span>
                              {item.description}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
