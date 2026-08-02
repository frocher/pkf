---
id: SK001
type: Skill
title: "Kubernetes"
description: "Ability to operate and troubleshoot containerized workloads on a Kubernetes cluster."
category: Technical
---

# Description

Kubernetes covers the ability to design, deploy, and operate
containerized workloads on a Kubernetes cluster — writing and
maintaining manifests, managing deployments and rollouts, configuring
networking and ingress, and troubleshooting a cluster under load or
under failure. In this bundle it is the skill underpinning the
Platform Migration project's entire target infrastructure: `DEC002`
committed the project to a managed Kubernetes offering from CloudScale
Hosting (`V001`) specifically to offload control-plane operations, but
someone on the team still has to operate everything above that layer
— the workloads, the networking between the new microservices, and
the cluster configuration itself.

The project's skill matrix reflects how central this is: `SR001`
requires Advanced-level Kubernetes skill at Critical criticality, with
a headcount need of two people, the highest bar set anywhere in either
project's skill requirements. Currently only one person in the bundle
is recorded as holding it at that level — Marcus Chen (`COMP001`), an
Expert with six years of experience and a certification — which is
the same concentration of knowledge already flagged as an
organizational risk on the project (`R002`) for architecture generally
and applies just as much to the operational side covered by this
skill.
