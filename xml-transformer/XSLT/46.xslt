<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ns0="http://datacite.org/schema/kernel-3" xmlns:tbf="http://www.altova.com/MapForce/UDF/tbf" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xml="http://www.w3.org/XML/1998/namespace" exclude-result-prefixes="ns0 tbf xs">
	<xsl:template name="tbf:tbf1_">
		<xsl:param name="input" select="/.."/>
		<xsl:for-each select="$input/@identifierType">
			<xsl:variable name="var1_current" select="."/>
			<xsl:attribute name="identifierType">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:value-of select="$input"/>
	</xsl:template>
	<xsl:template name="tbf:tbf2_nameIdentifier">
		<xsl:param name="input" select="/.."/>
		<xsl:for-each select="$input/@nameIdentifierScheme">
			<xsl:variable name="var1_current" select="."/>
			<xsl:attribute name="nameIdentifierScheme">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:for-each select="$input/@schemeURI">
			<xsl:variable name="var2_current" select="."/>
			<xsl:attribute name="schemeURI">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:value-of select="$input"/>
	</xsl:template>
	<xsl:template name="tbf:tbf3_">
		<xsl:param name="input" select="/.."/>
		<xsl:for-each select="$input/@titleType">
			<xsl:variable name="var1_current" select="."/>
			<xsl:attribute name="titleType">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:for-each select="$input/@xml:lang">
			<xsl:variable name="var2_current" select="."/>
			<xsl:attribute name="xml:lang">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:value-of select="$input"/>
	</xsl:template>
	<xsl:template name="tbf:tbf4_">
		<xsl:param name="input" select="/.."/>
		<xsl:for-each select="$input/@resourceTypeGeneral">
			<xsl:variable name="var1_current" select="."/>
			<xsl:attribute name="resourceTypeGeneral">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:value-of select="$input"/>
	</xsl:template>
	<xsl:template name="tbf:tbf5_">
		<xsl:param name="input" select="/.."/>
		<xsl:for-each select="$input/@alternateIdentifierType">
			<xsl:variable name="var1_current" select="."/>
			<xsl:attribute name="alternateIdentifierType">
				<xsl:value-of select="."/>
			</xsl:attribute>
		</xsl:for-each>
		<xsl:value-of select="$input"/>
	</xsl:template>
	<xsl:output method="xml" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<xsl:variable name="var1_initial" select="."/>
		<resource xmlns="http://datacite.org/schema/kernel-4">
			<xsl:attribute name="xsi:schemaLocation" namespace="http://www.w3.org/2001/XMLSchema-instance">http://datacite.org/schema/kernel-4 file:///C:/xampp/htdocs/DataCiteMappings/DataCiteMappings/meta/kernel-4.6/metadata.xsd</xsl:attribute>
			<xsl:for-each select="ns0:resource">
				<xsl:variable name="var2_cur" select="."/>
				<identifier>
					<xsl:call-template name="tbf:tbf1_">
						<xsl:with-param name="input" select="ns0:identifier"/>
					</xsl:call-template>
				</identifier>
				<creators>
					<xsl:for-each select="ns0:creators/ns0:creator">
						<xsl:variable name="var3_cur" select="."/>
						<creator>
							<creatorName>
								<xsl:value-of select="ns0:creatorName"/>
							</creatorName>
							<xsl:for-each select="ns0:nameIdentifier">
								<xsl:variable name="var4_cur" select="."/>
								<nameIdentifier>
									<xsl:call-template name="tbf:tbf2_nameIdentifier">
										<xsl:with-param name="input" select="."/>
									</xsl:call-template>
								</nameIdentifier>
							</xsl:for-each>
							<xsl:for-each select="ns0:affiliation">
								<xsl:variable name="var5_cur" select="."/>
								<affiliation>
									<xsl:value-of select="."/>
								</affiliation>
							</xsl:for-each>
						</creator>
					</xsl:for-each>
				</creators>
				<titles>
					<xsl:for-each select="ns0:titles/ns0:title">
						<xsl:variable name="var6_cur" select="."/>
						<title>
							<xsl:call-template name="tbf:tbf3_">
								<xsl:with-param name="input" select="."/>
							</xsl:call-template>
						</title>
					</xsl:for-each>
				</titles>
				<publisher>
					<xsl:value-of select="ns0:publisher"/>
				</publisher>
				<publicationYear>
					<xsl:value-of select="ns0:publicationYear"/>
				</publicationYear>
				<xsl:for-each select="ns0:resourceType">
					<xsl:variable name="var7_cur" select="."/>
					<resourceType>
						<xsl:call-template name="tbf:tbf4_">
							<xsl:with-param name="input" select="."/>
						</xsl:call-template>
					</resourceType>
				</xsl:for-each>
				<xsl:for-each select="ns0:subjects">
					<xsl:variable name="var8_cur" select="."/>
					<subjects>
						<xsl:for-each select="ns0:subject">
							<xsl:variable name="var9_cur" select="."/>
							<subject>
								<xsl:for-each select="@subjectScheme">
									<xsl:variable name="var10_cur" select="."/>
									<xsl:attribute name="subjectScheme" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="@schemeURI">
									<xsl:variable name="var11_cur" select="."/>
									<xsl:attribute name="schemeURI" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="@xml:lang">
									<xsl:variable name="var12_cur" select="."/>
									<xsl:attribute name="xml:lang">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:value-of select="."/>
							</subject>
						</xsl:for-each>
					</subjects>
				</xsl:for-each>
				<xsl:for-each select="ns0:contributors">
					<xsl:variable name="var13_cur" select="."/>
					<contributors>
						<xsl:for-each select="ns0:contributor">
							<xsl:variable name="var14_cur" select="."/>
							<contributor>
								<xsl:attribute name="contributorType" namespace="">
									<xsl:value-of select="@contributorType"/>
								</xsl:attribute>
								<contributorName>
									<xsl:value-of select="ns0:contributorName"/>
								</contributorName>
								<xsl:for-each select="ns0:nameIdentifier">
									<xsl:variable name="var15_cur" select="."/>
									<nameIdentifier>
										<xsl:call-template name="tbf:tbf2_nameIdentifier">
											<xsl:with-param name="input" select="."/>
										</xsl:call-template>
									</nameIdentifier>
								</xsl:for-each>
								<xsl:for-each select="ns0:affiliation">
									<xsl:variable name="var16_cur" select="."/>
									<affiliation>
										<xsl:value-of select="."/>
									</affiliation>
								</xsl:for-each>
							</contributor>
						</xsl:for-each>
					</contributors>
				</xsl:for-each>
				<xsl:for-each select="ns0:dates">
					<xsl:variable name="var17_cur" select="."/>
					<dates>
						<xsl:for-each select="ns0:date">
							<xsl:variable name="var18_cur" select="."/>
							<date>
								<xsl:attribute name="dateType" namespace="">
									<xsl:value-of select="@dateType"/>
								</xsl:attribute>
								<xsl:value-of select="."/>
							</date>
						</xsl:for-each>
					</dates>
				</xsl:for-each>
				<xsl:for-each select="ns0:language">
					<xsl:variable name="var19_cur" select="."/>
					<language>
						<xsl:value-of select="."/>
					</language>
				</xsl:for-each>
				<xsl:for-each select="ns0:alternateIdentifiers">
					<xsl:variable name="var20_cur" select="."/>
					<alternateIdentifiers>
						<xsl:for-each select="ns0:alternateIdentifier">
							<xsl:variable name="var21_cur" select="."/>
							<alternateIdentifier>
								<xsl:call-template name="tbf:tbf5_">
									<xsl:with-param name="input" select="."/>
								</xsl:call-template>
							</alternateIdentifier>
						</xsl:for-each>
					</alternateIdentifiers>
				</xsl:for-each>
				<xsl:for-each select="ns0:relatedIdentifiers">
					<xsl:variable name="var22_cur" select="."/>
					<relatedIdentifiers>
						<xsl:for-each select="ns0:relatedIdentifier">
							<xsl:variable name="var23_cur" select="."/>
							<relatedIdentifier>
								<xsl:attribute name="relatedIdentifierType" namespace="">
									<xsl:value-of select="@relatedIdentifierType"/>
								</xsl:attribute>
								<xsl:attribute name="relationType" namespace="">
									<xsl:value-of select="@relationType"/>
								</xsl:attribute>
								<xsl:for-each select="@relatedMetadataScheme">
									<xsl:variable name="var24_cur" select="."/>
									<xsl:attribute name="relatedMetadataScheme" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="@schemeURI">
									<xsl:variable name="var25_cur" select="."/>
									<xsl:attribute name="schemeURI" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="@schemeType">
									<xsl:variable name="var26_cur" select="."/>
									<xsl:attribute name="schemeType" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:value-of select="."/>
							</relatedIdentifier>
						</xsl:for-each>
					</relatedIdentifiers>
				</xsl:for-each>
				<xsl:for-each select="ns0:sizes">
					<xsl:variable name="var27_cur" select="."/>
					<sizes>
						<xsl:for-each select="ns0:size">
							<xsl:variable name="var28_cur" select="."/>
							<size>
								<xsl:value-of select="."/>
							</size>
						</xsl:for-each>
					</sizes>
				</xsl:for-each>
				<xsl:for-each select="ns0:formats">
					<xsl:variable name="var29_cur" select="."/>
					<formats>
						<xsl:for-each select="ns0:format">
							<xsl:variable name="var30_cur" select="."/>
							<format>
								<xsl:value-of select="."/>
							</format>
						</xsl:for-each>
					</formats>
				</xsl:for-each>
				<xsl:for-each select="ns0:version">
					<xsl:variable name="var31_cur" select="."/>
					<version>
						<xsl:value-of select="."/>
					</version>
				</xsl:for-each>
				<xsl:for-each select="ns0:rightsList">
					<xsl:variable name="var32_cur" select="."/>
					<rightsList>
						<xsl:for-each select="ns0:rights">
							<xsl:variable name="var33_cur" select="."/>
							<rights>
								<xsl:for-each select="@rightsURI">
									<xsl:variable name="var34_cur" select="."/>
									<xsl:attribute name="rightsURI" namespace="">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:value-of select="."/>
							</rights>
						</xsl:for-each>
					</rightsList>
				</xsl:for-each>
				<xsl:for-each select="ns0:descriptions">
					<xsl:variable name="var35_cur" select="."/>
					<descriptions>
						<xsl:for-each select="ns0:description">
							<xsl:variable name="var36_cur" select="."/>
							<description>
								<xsl:attribute name="descriptionType" namespace="">
									<xsl:value-of select="@descriptionType"/>
								</xsl:attribute>
								<xsl:for-each select="@xml:lang">
									<xsl:variable name="var37_cur" select="."/>
									<xsl:attribute name="xml:lang">
										<xsl:value-of select="."/>
									</xsl:attribute>
								</xsl:for-each>
								<xsl:for-each select="node()">
									<xsl:variable name="var38_sd" select="."/>
									<xsl:if test="self::text()">
										<xsl:value-of select="."/>
									</xsl:if>
									<xsl:if test="self::ns0:br">
										<br/>
									</xsl:if>
								</xsl:for-each>
							</description>
						</xsl:for-each>
					</descriptions>
				</xsl:for-each>
				<xsl:for-each select="ns0:geoLocations">
					<xsl:variable name="var39_cur" select="."/>
					<geoLocations>
						<xsl:for-each select="ns0:geoLocation">
							<xsl:variable name="var40_cur" select="."/>
							<geoLocation>
								<xsl:for-each select="ns0:geoLocationPlace">
									<xsl:variable name="var41_cur" select="."/>
									<geoLocationPlace>
										<xsl:for-each select="(./node())[./self::text()]">
											<xsl:variable name="var42_filter" select="."/>
											<xsl:value-of select="."/>
										</xsl:for-each>
									</geoLocationPlace>
								</xsl:for-each>
								<xsl:for-each select="ns0:geoLocationPoint">
									<xsl:variable name="var43_cur" select="."/>
									<geoLocationPoint/>
								</xsl:for-each>
								<xsl:for-each select="ns0:geoLocationBox">
									<xsl:variable name="var44_cur" select="."/>
									<geoLocationBox/>
								</xsl:for-each>
							</geoLocation>
						</xsl:for-each>
					</geoLocations>
				</xsl:for-each>
			</xsl:for-each>
		</resource>
	</xsl:template>
</xsl:stylesheet>
