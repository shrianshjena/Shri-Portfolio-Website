"use client";

import { Component, type ReactNode } from "react";

/*
 * If the Spline runtime throws (network, WebGL, CSP), render nothing: the
 * hero poster sits underneath, so failure is invisible to the visitor.
 */
interface SplineErrorBoundaryProps {
  readonly children: ReactNode;
}

interface SplineErrorBoundaryState {
  readonly hasError: boolean;
}

export class SplineErrorBoundary extends Component<
  SplineErrorBoundaryProps,
  SplineErrorBoundaryState
> {
  state: SplineErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SplineErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
